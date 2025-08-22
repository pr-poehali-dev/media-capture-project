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
      // ВАЖНО: В реальном проекте нужно зарегистрировать приложение в Яндекс.Консоли
      // и получить настоящий CLIENT_ID. Пока используем демо-режим.
      
      // Проверяем, что введены данные (для демо)
      if (!email.trim()) {
        throw new Error('Введите ваш email от Яндекс аккаунта');
      }
      
      // Имитируем процесс авторизации с задержкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // В демо-режиме создаем пользователя на основе введенного email
      const userData = {
        email: email,
        name: email.split('@')[0],
        token: 'demo_token_' + Math.random().toString(36).substring(7)
      };
      
      setYandexUser(userData);
      setShowAuthModal(false);
      
      alert(
        `✅ Демо-авторизация успешна!\n\n` +
        `Пользователь: ${userData.name}\n` +
        `Email: ${userData.email}\n\n` +
        `⚠️ ВНИМАНИЕ: Это демо-режим!\n` +
        `В реальном проекте нужно:\n` +
        `1. Зарегистрировать приложение в Яндекс.Консоли\n` +
        `2. Получить CLIENT_ID для OAuth\n` +
        `3. Настроить домен для редиректа`
      );
      
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
      
      // Симулируем загрузку на Яндекс.Диск (демо-режим)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // В реальном проекте здесь был бы код загрузки через Yandex Disk API
      const fileSize = (blob.size / 1024 / 1024).toFixed(2); // размер в МБ
      
      alert(
        `✅ Видео успешно "загружено" на Яндекс.Диск!\n\n` +
        `📁 Папка: "${folderPath}"\n` +
        `📄 Файл: ${filename}\n` +
        `📊 Размер: ${fileSize} МБ\n` +
        `👤 Аккаунт: ${yandexUser.email}\n\n` +
        `⚠️ ДЕМО-РЕЖИМ: Файл не загружен реально\n\n` +
        `Для реальной загрузки нужно:\n` +
        `1. Зарегистрировать приложение в Яндекс.Консоли\n` +
        `2. Получить CLIENT_ID и настроить OAuth\n` +
        `3. Реализовать Yandex Disk API`
      );
      
    } catch (error) {
      console.error('Ошибка загрузки на Яндекс.Диск:', error);
      alert(`Ошибка загрузки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
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

  const shareToTelegram = async () => {
    if (!recordedVideo) return;

    try {
      // Получаем blob видео
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const filename = `imperia_video_${new Date().getTime()}.${extension}`;
      
      // Проверяем доступность Web Share API
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: blob.type });
          
          // Проверяем поддержку файлов
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'IMPERIA PROMO Video',
              text: 'Поделиться видео через Telegram',
              files: [file]
            });
            return;
          }
        } catch (shareError) {
          console.log('Web Share API недоступен:', shareError);
        }
      }

      // Определяем платформу и браузер
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isMobile = isIOS || isAndroid;
      
      if (isMobile) {
        // Для мобильных устройств используем Telegram URL схему
        const telegramText = encodeURIComponent('Видео создано с помощью IMPERIA PROMO 🎬');
        
        // Сначала пробуем открыть Telegram через URL схему
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${telegramText}`;
        
        // Создаем временную ссылку для скачивания файла
        const videoUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        
        // Показываем инструкции пользователю
        const instructions = isIOS 
          ? `📱 Для отправки видео в Telegram на iPhone:\n\n1. Сначала сохраните видео в галерею:\n   • Нажмите "Сохранить локально"\n   • Следуйте инструкциям для сохранения\n\n2. Затем откройте Telegram:\n   • Выберите чат или канал\n   • Нажмите 📎 (прикрепить)\n   • Выберите "Фото и видео"\n   • Выберите сохраненное видео\n\n3. Добавьте описание: "Видео создано с IMPERIA PROMO 🎬"`
          : `📱 Для отправки видео в Telegram на Android:\n\n1. Скачайте видео (автоматически начнется)\n2. Откройте Telegram\n3. Выберите чат или канал\n4. Нажмите 📎 → Файл\n5. Найдите файл "${filename}"\n6. Добавьте описание: "Видео создано с IMPERIA PROMO 🎬"`;

        alert(instructions);

        // Автоматически скачиваем файл на Android
        if (isAndroid) {
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }

        // Открываем Telegram для добавления описания
        setTimeout(() => {
          window.open(telegramUrl, '_blank');
        }, 1000);

        // Очищаем URL через 5 минут
        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
        }, 300000);

      } else {
        // Для десктопа показываем инструкции
        const videoUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
        }, 100);

        alert(
          `💻 Для отправки в Telegram Web:\n\n` +
          `1. Видео скачано: "${filename}"\n` +
          `2. Откройте Telegram Web или приложение\n` +
          `3. Выберите чат или канал\n` +
          `4. Перетащите файл в окно чата\n` +
          `5. Добавьте описание: "Видео создано с IMPERIA PROMO 🎬"`
        );
      }

    } catch (error) {
      console.error('Ошибка при отправке в Telegram:', error);
      alert(
        `Ошибка при подготовке к отправке в Telegram.\n\n` +
        `Попробуйте:\n` +
        `1. Сохранить видео локально\n` +
        `2. Вручную отправить через Telegram\n\n` +
        `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
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
        onShareToTelegram={shareToTelegram}
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