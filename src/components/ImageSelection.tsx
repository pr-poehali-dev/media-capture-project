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
  const [checkingPermissions, setCheckingPermissions] = useState(false);

  const requestPermissions = useCallback(async () => {
    // Проверяем, что это Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (!isAndroid) return true;
    
    setCheckingPermissions(true);
    
    try {
      // Запрашиваем разрешения через современные API
      if ('permissions' in navigator && 'query' in navigator.permissions) {
        try {
          // Проверяем разрешение на камеру (часто связано с медиафайлами)
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          if (cameraPermission.state === 'denied') {
            alert('Для работы с изображениями необходимо разрешение на доступ к камере и файлам.\nПожалуйста, разрешите доступ в настройках браузера.');
            setShowHelp(true);
            return false;
          }
        } catch (permError) {
          console.log('Permission query failed:', permError);
        }
      }
      
      // Пытаемся получить доступ к медиа для проверки разрешений
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          // Запрашиваем минимальный доступ к камере для проверки разрешений
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1, height: 1 },
            audio: false 
          });
          // Сразу останавливаем поток
          stream.getTracks().forEach(track => track.stop());
          return true;
        } catch (mediaError: any) {
          if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
            alert('Доступ к камере и файлам заблокирован.\nРазрешите доступ для загрузки изображений.');
            setShowHelp(true);
            return false;
          }
          // Если ошибка не связана с разрешениями - продолжаем
          console.log('Media error (not permission related):', mediaError);
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.log('Permission check failed:', error);
      return true; // Продолжаем в случае ошибки проверки
    } finally {
      setCheckingPermissions(false);
    }
  }, [setShowHelp]);

  const handleGalleryClick = useCallback(async () => {
    playClickSound();
    
    // Запрашиваем разрешения для Android
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return; // Прерываем выполнение, если нет разрешений
    }
    
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  }, [playClickSound, requestPermissions]);

  const handleCameraClick = useCallback(async () => {
    playClickSound();
    
    // Запрашиваем разрешения для Android (особенно важно для камеры)
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return; // Прерываем выполнение, если нет разрешений
    }
    
    setTimeout(() => {
      cameraInputRef.current?.click();
    }, 100);
  }, [playClickSound, requestPermissions]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      onImageSelect(event);
    } catch (error: any) {
      console.error('Ошибка при выборе файла:', error);
      
      // Проверяем, связана ли ошибка с разрешениями на Android
      const isAndroid = /Android/i.test(navigator.userAgent);
      const errorMessage = error?.message || String(error);
      
      if (isAndroid && (errorMessage.toLowerCase().includes('permission') || 
                        errorMessage.toLowerCase().includes('разрешение') ||
                        errorMessage.toLowerCase().includes('denied'))) {
        alert('Нет разрешения на доступ к файлам.\n\n' +
              'Для Android:\n' +
              '1. Разрешите доступ в всплывающем окне\n' +
              '2. Проверьте настройки браузера\n' +
              '3. Перезагрузите страницу и повторите попытку');
        setShowHelp(true);
      } else {
        alert('Произошла ошибка при выборе файла. Попробуйте еще раз.');
      }
      
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [onImageSelect, setShowHelp]);

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
              className={`w-full h-20 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-university hover:bg-blue-50 transition-all ${checkingPermissions ? 'opacity-50 cursor-wait' : ''}`}
            >
              <div className="flex items-center gap-3">
                {checkingPermissions ? (
                  <Icon name="Loader2" size={24} className="text-blue-500 animate-spin" />
                ) : (
                  <Icon name="Camera" size={24} className="text-blue-500" />
                )}
                <span className="text-blue-600 font-medium">
                  {checkingPermissions ? 'Проверка разрешений...' : 'Открыть камеру'}
                </span>
              </div>
            </div>
            
            <div 
              onClick={handleGalleryClick}
              className={`w-full h-20 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-university hover:bg-blue-50 transition-all ${checkingPermissions ? 'opacity-50 cursor-wait' : ''}`}
            >
              <div className="flex items-center gap-3">
                {checkingPermissions ? (
                  <Icon name="Loader2" size={24} className="text-blue-500 animate-spin" />
                ) : (
                  <Icon name="Image" size={24} className="text-blue-500" />
                )}
                <span className="text-blue-600 font-medium">
                  {checkingPermissions ? 'Проверка разрешений...' : 'Выбрать из галереи'}
                </span>
              </div>
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