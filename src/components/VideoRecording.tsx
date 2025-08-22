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

  const handleNotebookChange = (field: keyof NotebookData, value: string) => {
    // Разрешить ввод только во время активной записи
    if (!isRecording) {
      return;
    }
    
    const newData = { ...notebookData, [field]: value };
    onNotebookDataChange?.(newData);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid для равных блоков */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
          
          {/* Блок 1 - Выбранная картинка */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                  <Icon name="Image" size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">QR код</h3>
              </div>
              
              {selectedImage ? (
                <div className="flex-1 flex items-center justify-center">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => setIsImageEnlarged(true)}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Icon name="ImagePlus" size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">QR код не выбран</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

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

          {/* Блок 2 - Анкета */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                  <Icon name="BookOpen" size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Анкета</h3>
                {!isRecording && (
                  <div className="ml-auto">
                    <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Icon name="Lock" size={12} className="mr-1" />
                      Заблокировано
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="parentName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Имя родителя
                  </Label>
                  <Input
                    id="parentName"
                    type="text"
                    value={notebookData.parentName}
                    onChange={(e) => handleNotebookChange('parentName', e.target.value)}
                    placeholder={!isRecording ? "Доступно только во время записи" : "Введите имя родителя"}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    disabled={!isRecording}
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
                    placeholder={!isRecording ? "Доступно только во время записи" : "Введите имя ребенка"}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    disabled={!isRecording}
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
                    placeholder={!isRecording ? "Доступно только во время записи" : "Введите возраст"}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    disabled={!isRecording}
                  />
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Icon name="FileText" size={16} className="mr-2 text-blue-500" />
                    Заметки
                  </h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    {notebookData.parentName && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span><strong>Родитель:</strong> {notebookData.parentName}</span>
                      </div>
                    )}
                    {notebookData.childName && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span><strong>Ребенок:</strong> {notebookData.childName}</span>
                      </div>
                    )}
                    {notebookData.age && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <span><strong>Возраст:</strong> {notebookData.age}</span>
                      </div>
                    )}
                    {!notebookData.parentName && !notebookData.childName && !notebookData.age && (
                      <div className="text-center py-4 text-gray-400">
                        <Icon name="FileText" size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Заметки появятся после заполнения полей</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Блок 3 - Запись видео */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-3">
                  <Icon name="Video" size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Контроль качества</h3>
                {isRecording && (
                  <div className="ml-auto">
                    <div className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Запись
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex-1 mb-4 min-h-0">
                {recordedVideo ? (
                  <video 
                    src={recordedVideo} 
                    controls 
                    className="w-full h-full object-cover rounded-2xl bg-black shadow-inner"
                  />
                ) : (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    muted 
                    className="w-full h-full object-cover rounded-2xl bg-black shadow-inner"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                )}
                
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    REC
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {!recordedVideo ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={onBack}
                      className="h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Icon name="ArrowLeft" size={16} className="mr-2" />
                      Назад
                    </Button>
                    <Button 
                      onClick={isRecording ? onStopRecording : onStartRecording}
                      className={`h-12 rounded-xl transition-all duration-200 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25' 
                          : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                      } text-white`}
                    >
                      <Icon name={isRecording ? "Square" : "Circle"} size={16} className="mr-2" />
                      {isRecording ? 'Стоп' : 'Запись'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={onRetake}
                      className="h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Icon name="RotateCcw" size={16} className="mr-2" />
                      Пересъёмка
                    </Button>
                    <Button 
                      onClick={onNext}
                      className="h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200"
                    >
                      Далее
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoRecording;