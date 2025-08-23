import { useRef, useState } from 'react';

export const useSimpleCamera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Максимально простой запрос камеры для Android
  const requestCamera = async () => {
    try {
      // Простейшие настройки для Android
      const constraints = {
        video: {
          facingMode: 'user', // Передняя камера по умолчанию
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        // Для Android - принудительный запуск
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Игнорируем ошибки автовоспроизведения
            });
          }
        }, 100);
      }

      return stream;
    } catch (error) {
      setHasPermission(false);
      
      // Android-специфичные ошибки
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('🔒 Разрешите доступ к камере в настройках браузера');
      } else {
        alert('📱 Не удалось получить доступ к камере');
      }
      
      throw error;
    }
  };

  // Упрощенная запись
  const startRecording = async () => {
    try {
      let stream = streamRef.current;
      
      if (!stream) {
        stream = await requestCamera();
      }

      if (!stream) throw new Error('Нет доступа к камере');

      // Простой MediaRecorder без опций
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
        stopStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Ошибка записи:', error);
      alert('❌ Ошибка записи видео');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Переключение камеры (передняя/задняя)
  const switchCamera = async () => {
    const currentFacing = streamRef.current
      ?.getVideoTracks()[0]
      ?.getSettings()?.facingMode;
    
    const newFacing = currentFacing === 'user' ? 'environment' : 'user';
    
    stopStream();
    
    try {
      const constraints = {
        video: {
          facingMode: newFacing,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (error) {
      // Fallback к любой доступной камере
      await requestCamera();
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const downloadVideo = () => {
    if (!recordedVideo) return;

    const a = document.createElement('a');
    a.href = recordedVideo;
    a.download = `video_${Date.now()}.webm`;
    a.click();
  };

  const reset = () => {
    setRecordedVideo(null);
    setIsRecording(false);
    stopStream();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  };

  return {
    isRecording,
    recordedVideo,
    hasPermission,
    videoRef,
    requestCamera,
    startRecording,
    stopRecording,
    switchCamera,
    downloadVideo,
    reset
  };
};