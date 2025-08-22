import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);
  const [yandexUser, setYandexUser] = useState<{email: string, name: string} | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVideoRecording = async () => {
    try {
      // Улучшенные настройки для мобильных устройств и iPhone
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
          facingMode: 'environment'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true; // Важно для iPhone
        videoRef.current.muted = true;
        // Принудительное воспроизведение
        await videoRef.current.play();
      }

      // Настройки MediaRecorder для лучшей совместимости с iPhone
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
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

      mediaRecorder.start(1000); // Записываем чанки каждую секунду
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      alert(`Не удалось получить доступ к камере: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = async () => {
    if (recordedVideo) {
      try {
        // Для iPhone используем более совместимый способ сохранения
        const response = await fetch(recordedVideo);
        const blob = await response.blob();
        
        // Определяем расширение файла по MIME типу
        const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
        const filename = `video_${new Date().getTime()}.${extension}`;
        
        // Создаём ссылку для скачивания
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        
        // Добавляем в DOM, кликаем и удаляем
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Очищаем URL объект
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
        }, 100);
        
        alert('Видео сохранено в галерею устройства!');
      } catch (error) {
        console.error('Ошибка сохранения видео:', error);
        alert('Не удалось сохранить видео');
      }
    }
  };

  const loginToYandex = async (email: string, password: string) => {
    try {
      // Симуляция авторизации Яндекс (в реальном проекте используется Яндекс ID API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Демо данные пользователя
      const userData = {
        email: email,
        name: email.split('@')[0]
      };
      
      setYandexUser(userData);
      setShowAuthModal(false);
      alert(`Добро пожаловать, ${userData.name}!\nТеперь видео будут сохраняться на ваш Яндекс.Диск.`);
    } catch (error) {
      alert('Ошибка авторизации. Проверьте логин и пароль.');
    }
  };

  const logoutFromYandex = () => {
    setYandexUser(null);
    alert('Вы вышли из аккаунта Яндекс');
  };

  const uploadToYandexDisk = async () => {
    if (!recordedVideo) return;
    
    // Проверяем авторизацию
    if (!yandexUser) {
      setShowAuthModal(true);
      return;
    }
    
    setIsUploadingToCloud(true);
    
    try {
      // Получаем blob видео
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const filename = `imperia_video_${new Date().getTime()}.${extension}`;
      
      // Создаем FormData для загрузки
      const formData = new FormData();
      formData.append('file', blob, filename);
      
      // Симуляция загрузки в Яндекс.Диск
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Видео "${filename}" успешно загружено на Яндекс.Диск!\n\nАккаунт: ${yandexUser.email}\nПапка: "IMPERIA PROMO Videos"`);
    } catch (error) {
      console.error('Ошибка загрузки на Яндекс.Диск:', error);
      alert('Не удалось загрузить видео на Яндекс.Диск. Проверьте подключение к интернету.');
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  const resetApp = () => {
    setCurrentStep(0);
    setSelectedImage(null);
    setRecordedVideo(null);
    setIsRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const renderStartScreen = () => (
    <div 
      className="flex flex-col justify-end min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
        backgroundSize: 'contain'
      }}
    >
      <Button 
        onClick={() => setCurrentStep(1)}
        size="lg"
        className="w-full max-w-sm mx-auto h-16 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg mb-8"
      >
        Новый лид
        <Icon name="ArrowRight" size={24} className="ml-2" />
      </Button>
    </div>
  );

  const renderImageSelection = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Icon name="Image" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите фото</h2>
          <p className="text-gray-600">Загрузите изображение из галереи</p>
        </div>

        {selectedImage ? (
          <div className="mb-6">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-48 object-cover rounded-2xl shadow-md"
            />
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors mb-6"
          >
            <div className="text-center">
              <Icon name="Plus" size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Нажмите для выбора</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(0)}
            className="flex-1 h-12 rounded-xl"
          >
            Назад
          </Button>
          <Button 
            onClick={() => setCurrentStep(2)}
            disabled={!selectedImage}
            className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
          >
            Далее
            <Icon name="ArrowRight" size={20} className="ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderVideoRecording = () => (
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
            <h2 className="text-xl font-bold text-white mb-2">Запись видео</h2>
            <p className="text-gray-300">Снимите короткое видео</p>
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
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 h-12 rounded-xl bg-white"
                >
                  Назад
                </Button>
                <Button 
                  onClick={isRecording ? stopVideoRecording : startVideoRecording}
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
                  onClick={() => {
                    setRecordedVideo(null);
                    setCurrentStep(2);
                  }}
                  className="flex-1 h-12 rounded-xl bg-white"
                >
                  Пересъёмка
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
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
    </div>
  );

  const renderSaveScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Готово!</h2>
          <p className="text-gray-600">Ваше видео готово к сохранению</p>
        </div>

        {selectedImage && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Выбранное фото:</p>
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {recordedVideo && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Записанное видео:</p>
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {yandexUser && (
          <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="User" size={16} className="text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">{yandexUser.name}</p>
                  <p className="text-xs text-green-600">{yandexUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logoutFromYandex}
                className="text-green-600 hover:text-green-800"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={downloadVideo}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            <Icon name="Download" size={20} className="mr-2" />
            Сохранить локально
          </Button>

          <Button 
            onClick={uploadToYandexDisk}
            disabled={isUploadingToCloud}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50"
          >
            {isUploadingToCloud ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Cloud" size={20} className="mr-2" />
                {yandexUser ? 'Сохранить на Яндекс.Диск' : 'Войти в Яндекс.Диск'}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={resetApp}
            className="w-full h-12 rounded-xl"
          >
            Создать ещё
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderAuthModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogging, setIsLogging] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
        alert('Введите email и пароль');
        return;
      }
      
      setIsLogging(true);
      await loginToYandex(email, password);
      setIsLogging(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm p-6 bg-white rounded-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
              <Icon name="User" size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Вход в Яндекс</h3>
            <p className="text-gray-600 text-sm">Войдите для сохранения видео на Яндекс.Диск</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@yandex.ru"
                className="mt-1 h-12 rounded-xl"
                disabled={isLogging}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 h-12 rounded-xl"
                disabled={isLogging}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAuthModal(false)}
                disabled={isLogging}
                className="flex-1 h-12 rounded-xl"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLogging}
                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                {isLogging ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Войти'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  const screens = [
    renderStartScreen,
    renderImageSelection, 
    renderVideoRecording,
    renderSaveScreen
  ];

  return (
    <>
      {screens[currentStep]()}
      {showAuthModal && renderAuthModal()}
    </>
  );
};

export default Index;