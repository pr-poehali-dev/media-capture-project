import { useRef, useState } from 'react';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const resetRecording = () => {
    setRecordedVideo(null);
    setIsRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
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