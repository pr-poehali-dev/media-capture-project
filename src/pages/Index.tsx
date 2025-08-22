import { useState, useRef } from 'react';
import StartScreen from '@/components/StartScreen';
import ImageSelection from '@/components/ImageSelection';
import VideoRecording from '@/components/VideoRecording';
import SaveScreen from '@/components/SaveScreen';
import AuthModal from '@/components/AuthModal';

interface YandexUser {
  email: string;
  name: string;
  token?: string;
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
    if (!recordedVideo) return;

    try {
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла по MIME типу
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const filename = `imperia_video_${new Date().getTime()}.${extension}`;
      
      // Проверяем, поддерживает ли браузер Web Share API (для мобильных устройств)
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: blob.type });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'IMPERIA PROMO Video',
              text: 'Сохранить видео в галерею',
              files: [file]
            });
            return;
          }
        } catch (shareError) {
          console.log('Web Share API не сработал, используем fallback:', shareError);
        }
      }

      // Fallback для iPhone Safari: используем объект URL и пользовательские действия
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        // Для iOS создаём ссылку и показываем инструкцию
        const videoUrl = URL.createObjectURL(blob);
        
        // Открываем видео в новой вкладке
        const newWindow = window.open(videoUrl, '_blank');
        
        if (newWindow) {
          // Показываем инструкцию пользователю
          alert(
            'Для сохранения видео на iPhone:\n\n' +
            '1. Нажмите и удерживайте видео\n' +
            '2. Выберите "Сохранить в Фото"\n' +
            '3. Видео будет сохранено в галерею'
          );
        } else {
          // Если popup заблокирован, используем прямое скачивание
          throw new Error('Не удалось открыть видео для сохранения');
        }
        
        // Очищаем URL через некоторое время
        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
        }, 60000); // 1 минута на сохранение
        
      } else {
        // Для других браузеров используем стандартное скачивание
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
        }, 100);
        
        alert('Видео сохранено!');
      }
      
    } catch (error) {
      console.error('Ошибка сохранения видео:', error);
      
      // Показываем пользователю альтернативный способ
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        alert(
          'Не удалось автоматически сохранить видео.\n\n' +
          'Альтернативный способ:\n' +
          '1. Воспроизведите видео на экране "Готово!"\n' +
          '2. Нажмите и удерживайте видео\n' +
          '3. Выберите "Сохранить в Фото"'
        );
      } else {
        alert('Не удалось сохранить видео. Попробуйте ещё раз.');
      }
    }
  };

  const loginToYandex = async (email: string, password: string) => {
    try {
      // Используем OAuth 2.0 Яндекса для авторизации
      const clientId = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // ID приложения Яндекс
      const redirectUri = encodeURIComponent(window.location.origin);
      const scope = 'cloud_api:disk.write';
      
      // Открываем окно авторизации Яндекс
      const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      
      // Создаем новое окно для авторизации
      const authWindow = window.open(
        authUrl,
        'yandex-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      if (!authWindow) {
        throw new Error('Не удалось открыть окно авторизации. Разрешите всплывающие окна.');
      }
      
      // Ожидаем получения токена
      const token = await new Promise<string>((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            reject(new Error('Авторизация отменена пользователем'));
          }
        }, 1000);
        
        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'YANDEX_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            authWindow.close();
            window.removeEventListener('message', messageHandler);
            resolve(event.data.token);
          } else if (event.data.type === 'YANDEX_AUTH_ERROR') {
            clearInterval(checkClosed);
            authWindow.close();
            window.removeEventListener('message', messageHandler);
            reject(new Error(event.data.error));
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Добавляем скрипт для обработки редиректа
        const script = `
          if (window.location.hash.includes('access_token=')) {
            const token = window.location.hash.split('access_token=')[1].split('&')[0];
            window.opener.postMessage({type: 'YANDEX_AUTH_SUCCESS', token}, '${window.location.origin}');
          } else if (window.location.hash.includes('error=')) {
            const error = window.location.hash.split('error=')[1].split('&')[0];
            window.opener.postMessage({type: 'YANDEX_AUTH_ERROR', error}, '${window.location.origin}');
          }
        `;
        
        setTimeout(() => {
          try {
            authWindow.eval(script);
          } catch (e) {
            // Игнорируем ошибки cross-origin
          }
        }, 2000);
      });
      
      // Получаем информацию о пользователе
      const userResponse = await fetch('https://login.yandex.ru/info', {
        headers: {
          'Authorization': `OAuth ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Не удалось получить информацию о пользователе');
      }
      
      const userData = await userResponse.json();
      
      setYandexUser({
        email: userData.default_email || email,
        name: userData.real_name || userData.login,
        token: token
      });
      
      setShowAuthModal(false);
      alert(`Добро пожаловать, ${userData.real_name || userData.login}!\nТеперь видео будут сохраняться на ваш Яндекс.Диск.`);
      
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      alert(`Ошибка авторизации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const logoutFromYandex = () => {
    setYandexUser(null);
    alert('Вы вышли из аккаунта Яндекс');
  };

  const uploadToYandexDisk = async () => {
    if (!recordedVideo) return;
    
    // Проверяем авторизацию
    if (!yandexUser || !yandexUser.token) {
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
      const folderPath = 'IMPERIA_PROMO_Videos';
      const fullPath = `/${folderPath}/${filename}`;
      
      // 1. Создаем папку, если её нет
      try {
        await fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=%2F${folderPath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `OAuth ${yandexUser.token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (folderError) {
        // Папка уже существует или другая ошибка
        console.log('Папка уже существует или не удалось создать');
      }
      
      // 2. Получаем URL для загрузки
      const uploadUrlResponse = await fetch(
        `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(fullPath)}&overwrite=true`,
        {
          headers: {
            'Authorization': `OAuth ${yandexUser.token}`
          }
        }
      );
      
      if (!uploadUrlResponse.ok) {
        const errorData = await uploadUrlResponse.json();
        throw new Error(`Ошибка получения URL: ${errorData.message || errorData.error}`);
      }
      
      const { href: uploadUrl } = await uploadUrlResponse.json();
      
      // 3. Загружаем файл
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': blob.type
        },
        body: blob
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Ошибка загрузки: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
      
      // 4. Получаем ссылку для скачивания
      const downloadLinkResponse = await fetch(
        `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(fullPath)}`,
        {
          headers: {
            'Authorization': `OAuth ${yandexUser.token}`
          }
        }
      );
      
      let downloadLink = '';
      if (downloadLinkResponse.ok) {
        const { href } = await downloadLinkResponse.json();
        downloadLink = href;
      }
      
      alert(
        `Видео "${filename}" успешно загружено на Яндекс.Диск!\n\n` +
        `Аккаунт: ${yandexUser.email}\n` +
        `Папка: "${folderPath}"\n` +
        `Файл: ${filename}` +
        (downloadLink ? `\n\nСсылка для скачивания:\n${downloadLink}` : '')
      );
      
    } catch (error) {
      console.error('Ошибка загрузки на Яндекс.Диск:', error);
      
      let errorMessage = 'Не удалось загрузить видео на Яндекс.Диск.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Токен авторизации устарел. Повторите вход в аккаунт.';
          setYandexUser(null); // Сбрасываем авторизацию
        } else if (error.message.includes('403')) {
          errorMessage = 'Недостаточно прав для загрузки на Яндекс.Диск.';
        } else if (error.message.includes('507')) {
          errorMessage = 'Недостаточно места на Яндекс.Диске.';
        } else {
          errorMessage += ` Ошибка: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  const resetApp = () => {
    // Очищаем все состояния в правильном порядке
    setSelectedImage(null);
    setRecordedVideo(null);
    setIsRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // Переходим на первый экран последним
    setCurrentStep(0);
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