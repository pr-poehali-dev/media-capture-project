import { useRef, useState } from 'react';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVideoRecording = async () => {
    try {
      // Настройки для задней камеры мобильного устройства
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        // Принудительный запуск для Android
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Тихо игнорируем ошибки автозапуска
            });
          }
        }, 100);
      }

      // Простейший MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('🔒 Разрешите доступ к камере в настройках браузера');
      } else {
        alert('📱 Ошибка доступа к камере. Попробуйте перезагрузить страницу.');
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