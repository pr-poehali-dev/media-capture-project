import { useState, useRef } from 'react';
import StartScreen from '@/components/StartScreen';
import ImageSelection from '@/components/ImageSelection';
import VideoRecording from '@/components/VideoRecording';
import SaveScreen from '@/components/SaveScreen';
import AuthModal from '@/components/AuthModal';

interface YandexUser {
  email: string;
  name: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);
  const [yandexUser, setYandexUser] = useState<YandexUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVideoRecording = async () => {
    try {
      // Улучшенные настройки для мобильных устройств и iPhone
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
          facingMode: 'environment'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true; // Важно для iPhone
        videoRef.current.muted = true;
        // Принудительное воспроизведение
        await videoRef.current.play();
      }

      // Настройки MediaRecorder для лучшей совместимости с iPhone
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // Остановка всех треков
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
          });
        }
      };

      mediaRecorder.start(1000); // Записываем чанки каждую секунду
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      alert(`Не удалось получить доступ к камере: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = async () => {
    if (recordedVideo) {
      try {
        // Для iPhone используем более совместимый способ сохранения
        const response = await fetch(recordedVideo);
        const blob = await response.blob();
        
        // Определяем расширение файла по MIME типу
        const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
        const filename = `video_${new Date().getTime()}.${extension}`;
        
        // Создаём ссылку для скачивания
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        
        // Добавляем в DOM, кликаем и удаляем
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Очищаем URL объект
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
        }, 100);
        
        alert('Видео сохранено в галерею устройства!');
      } catch (error) {
        console.error('Ошибка сохранения видео:', error);
        alert('Не удалось сохранить видео');
      }
    }
  };

  const loginToYandex = async (email: string, password: string) => {
    try {
      // Симуляция авторизации Яндекс (в реальном проекте используется Яндекс ID API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Демо данные пользователя
      const userData = {
        email: email,
        name: email.split('@')[0]
      };
      
      setYandexUser(userData);
      setShowAuthModal(false);
      alert(`Добро пожаловать, ${userData.name}!\nТеперь видео будут сохраняться на ваш Яндекс.Диск.`);
    } catch (error) {
      alert('Ошибка авторизации. Проверьте логин и пароль.');
    }
  };

  const logoutFromYandex = () => {
    setYandexUser(null);
    alert('Вы вышли из аккаунта Яндекс');
  };

  const uploadToYandexDisk = async () => {
    if (!recordedVideo) return;
    
    // Проверяем авторизацию
    if (!yandexUser) {
      setShowAuthModal(true);
      return;
    }
    
    setIsUploadingToCloud(true);
    
    try {
      // Получаем blob видео
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const filename = `imperia_video_${new Date().getTime()}.${extension}`;
      
      // Создаем FormData для загрузки
      const formData = new FormData();
      formData.append('file', blob, filename);
      
      // Симуляция загрузки в Яндекс.Диск
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Видео "${filename}" успешно загружено на Яндекс.Диск!\n\nАккаунт: ${yandexUser.email}\nПапка: "IMPERIA PROMO Videos"`);
    } catch (error) {
      console.error('Ошибка загрузки на Яндекс.Диск:', error);
      alert('Не удалось загрузить видео на Яндекс.Диск. Проверьте подключение к интернету.');
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  const resetApp = () => {
    setCurrentStep(0);
    setSelectedImage(null);
    setRecordedVideo(null);
    setIsRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleRetake = () => {
    setRecordedVideo(null);
    setCurrentStep(2);
  };

  const screens = [
    () => <StartScreen onStart={() => setCurrentStep(1)} />,
    () => (
      <ImageSelection 
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
        onBack={() => setCurrentStep(0)}
        onNext={() => setCurrentStep(2)}
      />
    ),
    () => (
      <VideoRecording 
        selectedImage={selectedImage}
        recordedVideo={recordedVideo}
        isRecording={isRecording}
        onBack={() => setCurrentStep(1)}
        onNext={() => setCurrentStep(3)}
        onStartRecording={startVideoRecording}
        onStopRecording={stopVideoRecording}
        onRetake={handleRetake}
        videoRef={videoRef}
      />
    ),
    () => (
      <SaveScreen 
        selectedImage={selectedImage}
        recordedVideo={recordedVideo}
        yandexUser={yandexUser}
        isUploadingToCloud={isUploadingToCloud}
        onDownloadVideo={downloadVideo}
        onUploadToYandex={uploadToYandexDisk}
        onLogoutFromYandex={logoutFromYandex}
        onReset={resetApp}
      />
    )
  ];

  return (
    <>
      {screens[currentStep]()}
      {showAuthModal && (
        <AuthModal 
          onLogin={loginToYandex}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
};

export default Index;