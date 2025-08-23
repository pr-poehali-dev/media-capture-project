import { useSimpleCamera } from '@/hooks/useSimpleCamera';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const SimpleCamera = () => {
  const {
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
  } = useSimpleCamera();

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Видео превью */}
      <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-md aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        
        {/* Overlay для статуса */}
        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 text-white text-center p-4">
            <div>
              <Icon name="Camera" size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Нет доступа к камере</p>
            </div>
          </div>
        )}
        
        {isRecording && (
          <div className="absolute top-2 left-2 flex items-center space-x-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>REC</span>
          </div>
        )}
      </div>

      {/* Управление */}
      <div className="flex flex-wrap justify-center gap-2">
        {!hasPermission && (
          <Button onClick={requestCamera} className="flex items-center space-x-2">
            <Icon name="Camera" size={16} />
            <span>Разрешить камеру</span>
          </Button>
        )}
        
        {hasPermission && !recordedVideo && (
          <>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center space-x-2"
            >
              <Icon name={isRecording ? "Square" : "Circle"} size={16} />
              <span>{isRecording ? 'Стоп' : 'Запись'}</span>
            </Button>
            
            <Button
              onClick={switchCamera}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Icon name="RotateCcw" size={16} />
              <span>Камера</span>
            </Button>
          </>
        )}
        
        {recordedVideo && (
          <>
            <Button
              onClick={downloadVideo}
              className="flex items-center space-x-2"
            >
              <Icon name="Download" size={16} />
              <span>Скачать</span>
            </Button>
            
            <Button
              onClick={reset}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Icon name="RotateCcw" size={16} />
              <span>Заново</span>
            </Button>
          </>
        )}
      </div>

      {/* Записанное видео */}
      {recordedVideo && (
        <div className="w-full max-w-md">
          <video
            src={recordedVideo}
            controls
            className="w-full rounded-lg"
            playsInline
          />
        </div>
      )}

      {/* Подсказки для Android */}
      <div className="text-xs text-gray-500 text-center max-w-md">
        <p>💡 Для Android: Разрешите доступ к камере в браузере</p>
        <p>🔄 Если видео не отображается - нажмите на экран</p>
      </div>
    </div>
  );
};

export default SimpleCamera;