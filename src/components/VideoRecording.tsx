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
}

interface NotebookData {
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
  videoRef 
}: VideoRecordingProps) => {
  const [notebookData, setNotebookData] = useState<NotebookData>({
    parentName: '',
    childName: '',
    age: ''
  });

  const handleNotebookChange = (field: keyof NotebookData, value: string) => {
    setNotebookData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <div className="flex flex-row min-h-screen bg-gray-900">
      {/* Первая часть - загруженная картинка */}
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

      {/* Вторая часть - запись видео */}
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
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-red-500 hover:bg-red-600'
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
                  className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                >
                  Далее
                  <Icon name="ArrowRight" size={20} className="ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Третья часть - блокнот */}
      <div className="flex-1 p-4">
        <Card className="h-full p-6 bg-white">
          <div className="flex items-center mb-6">
            <Icon name="BookOpen" size={24} className="mr-2 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">Блокнот</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="parentName" className="text-sm font-medium text-gray-700 mb-2 block">
                Имя родителя
              </Label>
              <Input
                id="parentName"
                type="text"
                value={notebookData.parentName}
                onChange={(e) => handleNotebookChange('parentName', e.target.value)}
                placeholder="Введите имя родителя"
                className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="childName" className="text-sm font-medium text-gray-700 mb-2 block">
                Имя ребенка
              </Label>
              <Input
                id="childName"
                type="text"
                value={notebookData.childName}
                onChange={(e) => handleNotebookChange('childName', e.target.value)}
                placeholder="Введите имя ребенка"
                className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="text-sm font-medium text-gray-700 mb-2 block">
                Возраст
              </Label>
              <Input
                id="age"
                type="text"
                value={notebookData.age}
                onChange={(e) => handleNotebookChange('age', e.target.value)}
                placeholder="Введите возраст"
                className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Заметки:</h4>
            <div className="text-sm text-gray-600 space-y-1">
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
    </div>
  );
};

export default VideoRecording;