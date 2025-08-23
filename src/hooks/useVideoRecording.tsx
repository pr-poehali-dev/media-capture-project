import { useRef, useState } from 'react';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVideoRecording = async () => {
    try {
      console.log('🚀 Начинаем запись видео...');
      
      // ПРОСТЕЙШИЕ настройки для максимальной совместимости
      const constraints = {
        video: true,
        audio: true
      };

      console.log('📱 Запрашиваем доступ к камере...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Поток получен:', stream.getTracks().length, 'треков');
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log('🎥 Подключаем поток к видео элементу...');
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        try {
          await videoRef.current.play();
          console.log('▶️ Видео запущено');
        } catch (playError) {
          console.warn('⚠️ Автовоспроизведение заблокировано:', playError);
          // Это нормально для многих браузеров
        }
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
        
        // Останавливаем поток
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            console.log('🔇 Трек остановлен:', track.kind);
          });
        }
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

  return {
    isRecording,
    recordedVideo,
    videoRef,
    startVideoRecording,
    stopVideoRecording,
    downloadVideo,
    resetRecording
  };
};