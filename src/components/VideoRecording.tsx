import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  notebookData?: NotebookData;
  onNotebookDataChange?: (data: NotebookData) => void;
}

export interface NotebookData {
  parentName: string;
  childName: string;
  age: string;
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
  videoRef,
  notebookData = { parentName: '', childName: '', age: '' },
  onNotebookDataChange
}: VideoRecordingProps) => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [showQualityBanner, setShowQualityBanner] = useState(false);

  const handleNotebookChange = (field: keyof NotebookData, value: string) => {
    const newData = { ...notebookData, [field]: value };
    onNotebookDataChange?.(newData);
    
    // Показать баннер, если пользователь начал вводить данные без записи видео
    if (value.trim() && !isRecording && !recordedVideo) {
      setShowQualityBanner(true);
      // Автоматически скрыть через 5 секунд
      setTimeout(() => setShowQualityBanner(false), 5000);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900">
      {/* Первая часть - загруженная картинка */}
      <div className="flex-1 bg-white p-2 lg:p-4 min-h-[200px] lg:min-h-auto">
        {selectedImage && (
          <div className="h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setIsImageEnlarged(true)}
            />
          </div>
        )}
      </div>

      {/* Модальное окно для увеличенной картинки */}
      {isImageEnlarged && selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setIsImageEnlarged(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-300">
            <img 
              src={selectedImage} 
              alt="Enlarged" 
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => setIsImageEnlarged(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-10 h-10 p-0 transition-all duration-200"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Баннер контроля качества */}
      {showQualityBanner && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <Card className="bg-yellow-50 border-yellow-200 p-4 shadow-lg max-w-md">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 mb-1">Включи контроль качества</h3>
                <p className="text-sm text-yellow-700">Запиши видео для лучшего результата</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQualityBanner(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Вторая часть - блокнот */}
      <div className="flex-1 p-2 lg:p-4">
        <Card className="h-full p-3 lg:p-6 bg-white">
          <div className="flex items-center mb-3 lg:mb-6">
            <Icon name="BookOpen" size={20} className="mr-2 text-blue-500 lg:w-6 lg:h-6" />
            <h3 className="text-lg lg:text-xl font-bold text-gray-800">Блокнот</h3>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            <div>
              <Label htmlFor="parentName" className="text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2 block">
                Имя родителя
              </Label>
              <Input
                id="parentName"
                type="text"
                value={notebookData.parentName}
                onChange={(e) => handleNotebookChange('parentName', e.target.value)}
                placeholder="Введите имя родителя"
                className="w-full h-10 lg:h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            
            <div>
              <Label htmlFor="childName" className="text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2 block">
                Имя ребенка
              </Label>
              <Input
                id="childName"
                type="text"
                value={notebookData.childName}
                onChange={(e) => handleNotebookChange('childName', e.target.value)}
                placeholder="Введите имя ребенка"
                className="w-full h-10 lg:h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2 block">
                Возраст
              </Label>
              <Input
                id="age"
                type="text"
                value={notebookData.age}
                onChange={(e) => handleNotebookChange('age', e.target.value)}
                placeholder="Введите возраст"
                className="w-full h-10 lg:h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-sm lg:text-base"
              />
            </div>
          </div>

          <div className="mt-3 lg:mt-6 p-3 lg:p-4 bg-gray-50 rounded-xl">
            <h4 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">Заметки:</h4>
            <div className="text-xs lg:text-sm text-gray-600 space-y-1">
              {notebookData.parentName && (
                <div>👤 <strong>Родитель:</strong> {notebookData.parentName}</div>
              )}
              {notebookData.childName && (
                <div>👶 <strong>Ребенок:</strong> {notebookData.childName}</div>
              )}
              {notebookData.age && (
                <div>🎂 <strong>Возраст:</strong> {notebookData.age}</div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Третья часть - запись видео */}
      <div className="flex-1 p-2 lg:p-4">
        <div className="h-full flex flex-col">
          <div className="text-center mb-2 lg:mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-white mb-1 lg:mb-2">Контроль качества</h2>
          </div>

          <div className="relative flex-1 mb-2 lg:mb-4 min-h-[250px] lg:min-h-auto">
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
              <div className="absolute top-2 lg:top-4 right-2 lg:right-4 flex items-center bg-red-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-1 lg:mr-2 animate-pulse"></div>
                REC
              </div>
            )}
          </div>

          <div className="flex gap-2 lg:gap-3">
            {!recordedVideo ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1 h-10 lg:h-12 rounded-xl bg-white text-sm lg:text-base"
                >
                  Назад
                </Button>
                <Button 
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={`flex-1 h-10 lg:h-12 rounded-xl text-sm lg:text-base ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  <Icon name={isRecording ? "Square" : "Circle"} size={16} className="mr-1 lg:mr-2 lg:w-5 lg:h-5" />
                  {isRecording ? 'Стоп' : 'Запись'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={onRetake}
                  className="flex-1 h-10 lg:h-12 rounded-xl bg-white text-sm lg:text-base"
                >
                  Пересъёмка
                </Button>
                <Button 
                  onClick={onNext}
                  className="flex-1 h-10 lg:h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm lg:text-base"
                >
                  Далее
                  <Icon name="ArrowRight" size={16} className="ml-1 lg:w-5 lg:h-5" />
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