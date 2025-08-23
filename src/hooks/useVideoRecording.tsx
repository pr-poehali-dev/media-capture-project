import { useRef, useState } from 'react';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [currentCamera, setCurrentCamera] = useState<'environment' | 'user'>('environment'); // 'environment' = тыловая, 'user' = фронтальная
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Получение списка камер
  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      console.log('📹 Найдено камер:', cameras.length);
      return cameras;
    } catch (error) {
      console.error('⚠️ Ошибка получения списка камер:', error);
      return [];
    }
  };

  // Запуск предпросмотра камеры
  const startCameraPreview = async (facingMode: 'environment' | 'user' = currentCamera) => {
    try {
      console.log(`📹 Запускаем камеру: ${facingMode === 'environment' ? 'тыловая' : 'фронтальная'}`);
      
      // Останавливаем текущий поток если есть
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: { facingMode },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setCurrentCamera(facingMode);
      setIsPreviewActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        try {
          await videoRef.current.play();
          console.log('▶️ Предпросмотр запущен');
        } catch (playError) {
          console.warn('⚠️ Автовоспроизведение заблокировано:', playError);
        }
      }
      
      return stream;
    } catch (error) {
      console.error('⚠️ Ошибка запуска камеры:', error);
      setIsPreviewActive(false);
      throw error;
    }
  };

  // Переключение камеры
  const switchCamera = async () => {
    if (isRecording) {
      console.warn('⚠️ Нельзя переключать камеру во время записи');
      return;
    }
    
    console.log('🔄 Переключаем камеру...');
    const newCamera = currentCamera === 'environment' ? 'user' : 'environment';
    
    try {
      await startCameraPreview(newCamera);
      console.log(`✅ Переключено на ${newCamera === 'environment' ? 'тыловую' : 'фронтальную'} камеру`);
    } catch (error) {
      console.error('❌ Ошибка переключения камеры:', error);
      // Возвращаемся к предыдущей камере
      try {
        await startCameraPreview(currentCamera);
      } catch (fallbackError) {
        console.error('❌ Не удалось вернуться к предыдущей камере:', fallbackError);
      }
    }
  };

  const startVideoRecording = async () => {
    try {
      console.log('🚀 Начинаем запись видео...');
      
      // Если предпросмотр не активен, запускаем камеру
      let stream = streamRef.current;
      if (!stream || !isPreviewActive) {
        stream = await startCameraPreview();
      }

      // Простейший MediaRecorder без сложных настроек
      console.log('🔴 Создаем MediaRecorder...');
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('📦 Получен чанк данных:', event.data.size, 'байт');
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🛑 Запись остановлена, обрабатываем данные...');
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        console.log('✅ Видео готово:', url);
        setRecordedVideo(url);
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ Ошибка MediaRecorder:', event);
      };

      console.log('🎬 Начинаем запись...');
      mediaRecorder.start();
      setIsRecording(true);
      console.log('✅ Запись началась!');
      
    } catch (error) {
      console.error('💥 Критическая ошибка:', error);
      
      // Показываем пользователю что именно произошло
      if (error instanceof Error) {
        console.log('Тип ошибки:', error.name);
        console.log('Сообщение:', error.message);
        
        if (error.name === 'NotAllowedError') {
          alert('❌ Доступ к камере запрещен.\n\n📱 Разрешите доступ к камере в настройках браузера и перезагрузите страницу.');
        } else if (error.name === 'NotFoundError') {
          alert('❌ Камера не найдена.\n\n📱 Проверьте подключение камеры.');
        } else if (error.name === 'NotSupportedError') {
          alert('❌ Ваш браузер не поддерживает запись видео.\n\n🔄 Попробуйте обновить браузер или использовать другой.');
        } else {
          alert(`❌ Ошибка камеры: ${error.message}\n\n🔄 Попробуйте перезагрузить страницу.`);
        }
      } else {
        alert('❌ Неизвестная ошибка при доступе к камере.\n\n🔄 Перезагрузите страницу и попробуйте снова.');
      }
    }
  };

  const stopVideoRecording = () => {
    console.log('🛑 Останавливаем запись...');
    
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log('✅ MediaRecorder остановлен');
        }
        setIsRecording(false);
      } catch (error) {
        console.error('❌ Ошибка остановки записи:', error);
        setIsRecording(false);
      }
    }
  };

  const downloadVideo = async () => {
    if (!recordedVideo) return;

    try {
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      const filename = `imperia_video_${new Date().getTime()}.webm`;
      
      // Для мобильных устройств используем простое скачивание
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
      
      alert('✅ Видео сохранено в загрузки!');
      
    } catch (error) {
      console.error('❌ Ошибка сохранения видео:', error);
      alert('❌ Не удалось сохранить видео. Попробуйте ещё раз.');
    }
  };

  const resetRecording = () => {
    console.log('🔄 Сброс записи...');
    
    setRecordedVideo(null);
    setIsRecording(false);
    setIsPreviewActive(false);
    
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {
        console.warn('⚠️ Ошибка остановки MediaRecorder:', e);
      }
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
          console.log('🔇 Трек остановлен:', track.kind);
        } catch (e) {
          console.warn('⚠️ Ошибка остановки трека:', e);
        }
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      console.log('📺 Видео элемент очищен');
    }
    
    console.log('✅ Сброс завершен');
  };

  const stopPreview = () => {
    console.log('🛑 Останавливаем предпросмотр...');
    
    if (streamRef.current && !isRecording) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsPreviewActive(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      console.log('✅ Предпросмотр остановлен');
    }
  };

  return {
    isRecording,
    recordedVideo,
    videoRef,
    currentCamera,
    availableCameras,
    isPreviewActive,
    startVideoRecording,
    stopVideoRecording,
    downloadVideo,
    resetRecording,
    switchCamera,
    startCameraPreview,
    stopPreview,
    getAvailableCameras
  };
};