import { useRef, useState } from 'react';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVideoRecording = async () => {
    try {
      // Простые и надежные настройки для всех устройств
      let constraints = {
        video: {
          width: { ideal: 720 },
          height: { ideal: 480 },
          frameRate: { ideal: 15, max: 30 },
          facingMode: 'environment'
        },
        audio: true
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.warn('Не удалось получить поток с идеальными настройками, пробуем упрощенные:', error);
        // Fallback: минимальные настройки
        constraints = {
          video: { facingMode: 'environment' },
          audio: true
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        // Ждем загрузки метаданных перед воспроизведением
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise.catch(e => {
            console.warn('Автовоспроизведение заблокировано:', e);
            // Это нормально для многих браузеров
          });
        }
      }

      // Определяем лучший поддерживаемый формат
      let mimeType = '';
      const possibleTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9,opus', 
        'video/webm',
        'video/mp4'
      ];
      
      for (const type of possibleTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      if (!mimeType) {
        throw new Error('Ваше устройство не поддерживает запись видео в браузере');
      }

      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 1000000 // 1 Mbps для экономии ресурсов
      });
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

      mediaRecorder.start(2000); // Записываем чанки каждые 2 секунды для экономии ресурсов
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      
      // Дружелюбные сообщения для пользователей
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Для записи видео необходимо разрешить доступ к камере и микрофону в настройках браузера.');
        } else if (error.name === 'NotFoundError') {
          alert('Камера не найдена. Проверьте подключение камеры.');
        } else if (error.name === 'NotSupportedError') {
          alert('Ваш браузер не поддерживает запись видео. Попробуйте обновить браузер.');
        } else {
          alert(`Ошибка камеры: ${error.message}`);
        }
      } else {
        alert('Неизвестная ошибка при доступе к камере. Попробуйте перезагрузить страницу.');
      }
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
      } catch (error) {
        console.warn('Ошибка остановки записи:', error);
        setIsRecording(false);
        // В случае ошибки все равно пытаемся остановить поток
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
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
    
    // Корректная очистка ресурсов
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {
        console.warn('Ошибка остановки MediaRecorder:', e);
      }
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Ошибка остановки трека:', e);
        }
      });
      streamRef.current = null;
    }
    
    // Очистка видео элемента
    if (videoRef.current) {
      videoRef.current.srcObject = null;
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