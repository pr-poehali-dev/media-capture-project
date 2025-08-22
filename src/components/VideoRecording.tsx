import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface VideoRecordingProps {
  selectedImage: string | null;
  recordedVideo: string | null;
  isRecording: boolean;
  onBack: () => void;
  onNext: () => void;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => void;
  onRetake: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoRecording = ({ 
  selectedImage, 
  recordedVideo, 
  isRecording, 
  onBack, 
  onNext, 
  onStartRecording, 
  onStopRecording,
  onRetake,
  videoRef 
}: VideoRecordingProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Верхняя часть - загруженная картинка */}
      <div className="flex-1 bg-white p-4">
        {selectedImage && (
          <div className="h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-md"
            />
          </div>
        )}
      </div>

      {/* Нижняя часть - запись видео */}
      <div className="flex-1 p-4">
        <div className="h-full flex flex-col">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-2">Контроль качества</h2>
          </div>

          <div className="relative flex-1 mb-4">
            {recordedVideo ? (
              <video 
                src={recordedVideo} 
                controls 
                className="w-full h-full object-cover rounded-2xl bg-black"
              />
            ) : (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted 
                className="w-full h-full object-cover rounded-2xl bg-black"
                style={{ transform: 'scaleX(-1)' }}
              />
            )}
            
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                REC
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!recordedVideo ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1 h-12 rounded-xl bg-white"
                >
                  Назад
                </Button>
                <Button 
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={`flex-1 h-12 rounded-xl ${
                    isRecording 
                      ? 'bg-blue-university hover:bg-blue-600' 
                      : 'bg-blue-university hover:bg-blue-600'
                  } text-white`}
                >
                  <Icon name={isRecording ? "Square" : "Circle"} size={20} className="mr-2" />
                  {isRecording ? 'Стоп' : 'Запись'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={onRetake}
                  className="flex-1 h-12 rounded-xl bg-white"
                >
                  Пересъёмка
                </Button>
                <Button 
                  onClick={onNext}
                  className="flex-1 h-12 bg-blue-university hover:bg-blue-600 text-white rounded-xl"
                >
                  Далее
                  <Icon name="ArrowRight" size={20} className="ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecording;