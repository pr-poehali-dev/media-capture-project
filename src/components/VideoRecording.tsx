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
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-blue-50 to-blue-100 p-4 lg:p-6 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-university/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-university-light/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Заголовок страницы */}
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-blue-university mb-2">Создание лида</h1>
          <p className="text-blue-university-dark/70 font-medium">Заполните данные и запишите видео для нового лида</p>
        </div>
        
        {/* Grid для равных блоков */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[calc(100vh-12rem)]">
          
          {/* Блок 1 - QR-код */}
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-md border border-blue-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-university/5 to-blue-600/8"></div>
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-university to-blue-600 flex items-center justify-center mr-4 shadow-lg">
                  <Icon name="QrCode" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-university">QR-код</h3>
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
                    <p className="text-sm">QR-код не выбран</p>
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
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-md border border-blue-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-university-light/8 to-blue-university/5"></div>
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-university-light to-blue-university flex items-center justify-center mr-4 shadow-lg">
                  <Icon name="BookOpen" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-university">Анкета</h3>
                {!isRecording && (
                  <div className="ml-auto">
                    <div className="flex items-center text-xs text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full font-medium">
                      <Icon name="Lock" size={14} className="mr-1.5" />
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

                <div className="mt-6 p-5 bg-gradient-to-r from-blue-university/5 to-blue-university-light/8 rounded-2xl border border-blue-university/20 backdrop-blur-sm">
                  <h4 className="text-base font-semibold text-blue-university mb-4 flex items-center">
                    <Icon name="FileText" size={18} className="mr-3 text-blue-university" />
                    Заметки
                  </h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    {notebookData.parentName && (
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 bg-blue-university rounded-full mr-3"></div>
                        <span><strong>Родитель:</strong> {notebookData.parentName}</span>
                      </div>
                    )}
                    {notebookData.childName && (
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 bg-blue-university-light rounded-full mr-3"></div>
                        <span><strong>Ребенок:</strong> {notebookData.childName}</span>
                      </div>
                    )}
                    {notebookData.age && (
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></div>
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
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-md border border-blue-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 to-blue-university-dark/5"></div>
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-university-dark flex items-center justify-center mr-4 shadow-lg">
                  <Icon name="Video" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-university">Контроль качества</h3>
                {isRecording && (
                  <div className="ml-auto">
                    <div className="flex items-center text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-full animate-pulse font-medium shadow-lg">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></div>
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
                    className="w-full h-full object-cover rounded-2xl bg-black shadow-2xl border border-blue-university/20"
                  />
                ) : (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    muted 
                    className="w-full h-full object-cover rounded-2xl bg-black shadow-2xl border border-blue-university/20"
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
                      className={`h-12 rounded-xl transition-all duration-300 font-semibold ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/30' 
                          : 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/30'
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
                      className="h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-xl shadow-green-500/30 transition-all duration-300 font-semibold"
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