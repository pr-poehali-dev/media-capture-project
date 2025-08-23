import { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useSound } from '@/hooks/useSound';
import MobileFileHelp from '@/components/ui/mobile-file-help';

interface ImageSelectionProps {
  selectedImage: string | null;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}

const ImageSelection = ({ selectedImage, onImageSelect, onBack, onNext }: ImageSelectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { playClickSound } = useSound();
  const [showHelp, setShowHelp] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleGalleryClick = useCallback(async () => {
    playClickSound();
    
    // Проверяем поддержку File API
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('Ваш браузер не поддерживает загрузку файлов');
      return;
    }

    try {
      // Попытка использовать современный File System Access API (если доступен)
      if ('showOpenFilePicker' in window) {
        try {
          const [fileHandle] = await (window as any).showOpenFilePicker({
            types: [
              {
                description: 'Изображения',
                accept: {
                  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
                }
              }
            ],
            multiple: false
          });
          
          const file = await fileHandle.getFile();
          
          // Создаем искусственное событие для совместимости с существующим кодом
          const mockEvent = {
            target: {
              files: [file],
              value: ''
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          handleFileChange(mockEvent);
          return;
        } catch (fsError: any) {
          console.log('File System Access API failed, falling back to input:', fsError);
          
          // Если пользователь отменил диалог - ничего не делаем
          if (fsError.name === 'AbortError') {
            return;
          }
          
          // Если ошибка доступа - показываем помощь
          if (fsError.message && fsError.message.toLowerCase().includes('permission')) {
            setShowHelp(true);
            return;
          }
        }
      }
      
      // Fallback к стандартному input
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 100);
      } else {
        fileInputRef.current?.click();
      }
      
    } catch (error: any) {
      console.error('Error in handleGalleryClick:', error);
      
      // Проверяем, связана ли ошибка с разрешениями
      if (error.message && error.message.toLowerCase().includes('permission')) {
        setShowHelp(true);
        return;
      }
      
      // В случае любой другой ошибки - используем стандартный способ
      fileInputRef.current?.click();
    }
  }, [playClickSound, handleFileChange]);

  const handleCameraClick = useCallback(() => {
    playClickSound();
    
    // Проверяем поддержку File API
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('Ваш браузер не поддерживает загрузку файлов');
      return;
    }

    // Для мобильных устройств добавляем дополнительную задержку
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      setTimeout(() => {
        cameraInputRef.current?.click();
      }, 100);
    } else {
      cameraInputRef.current?.click();
    }
  }, [playClickSound]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      onImageSelect(event);
    } catch (error) {
      console.error('Ошибка при выборе файла:', error);
      
      // Проверяем, не связана ли ошибка с разрешениями
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('permission') || 
          errorMessage.toLowerCase().includes('разрешение')) {
        alert('Нет разрешения на доступ к файлам. Попробуйте:\n1. Разрешить доступ в браузере\n2. Проверить настройки приложения\n3. Перезагрузить страницу');
        setShowHelp(true);
      } else {
        alert('Произошла ошибка при выборе файла. Попробуйте еще раз.');
      }
      
      // Очищаем input для повторной попытки
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [onImageSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      
      // Создаем искусственное событие для совместимости
      const mockEvent = {
        target: {
          files: [file],
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileChange(mockEvent);
    }
  }, [handleFileChange]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#ffffff' }}>
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-0" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-100">
            <Icon name="QrCode" size={32} className="text-blue-university" />
          </div>
          <h2 className="text-2xl font-bold text-blue-university mb-2">Выберите QR-код</h2>
          <button
            onClick={() => setShowHelp(true)}
            className="text-blue-400 text-sm underline hover:text-blue-600"
          >
            Не работает? Нужна помощь
          </button>
        </div>

        {selectedImage ? (
          <div className="mb-6 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-48 object-cover rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-blue-university animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="mb-6 space-y-4">
            <div 
              onClick={handleCameraClick}
              className="w-full h-20 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-university hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Icon name="Camera" size={24} className="text-blue-500" />
                <span className="text-blue-600 font-medium">Открыть камеру</span>
              </div>
            </div>
            
            <div 
              onClick={handleGalleryClick}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`w-full h-20 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-blue-university bg-blue-100 scale-105' 
                  : 'border-blue-300 hover:border-blue-university hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name="Image" size={24} className="text-blue-500" />
                <span className="text-blue-600 font-medium">
                  {dragActive ? 'Отпустите изображение' : 'Выбрать из галереи'}
                </span>
              </div>
            </div>
            
            <div className="text-center text-xs text-blue-400 mt-2">
              Или перетащите изображение сюда
            </div>
          </div>
        )}

        {/* Input для галереи */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/*"
          className="hidden"
        />
        
        {/* Input для камеры */}
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/*"
          capture="environment"
          className="hidden"
        />

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => { playClickSound(); onBack(); }}
            className="flex-1 h-12 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 font-semibold transform hover:scale-105 transition-all duration-200"
          >
            Назад
          </Button>
          <Button 
            onClick={() => { playClickSound(); onNext(); }}
            disabled={!selectedImage}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            Далее
            <Icon name="ArrowRight" size={20} className="ml-1" />
          </Button>
        </div>
      </Card>
      
      <MobileFileHelp 
        isVisible={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </div>
  );
};

export default ImageSelection;