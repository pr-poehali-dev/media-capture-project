import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // Остановка стрима
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (recordedVideo) {
      const a = document.createElement('a');
      a.href = recordedVideo;
      a.download = 'recorded-video.webm';
      a.click();
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl flex items-center justify-center">
          <Icon name="Camera" size={36} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
          Photo & Video App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Выберите фото и создайте видео
        </p>
      </div>
      
      <Button 
        onClick={() => setCurrentStep(1)}
        size="lg"
        className="w-full max-w-sm h-16 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg"
      >
        Начать
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900">
      <Card className="w-full max-w-md p-6 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Запись видео</h2>
          <p className="text-gray-600">Снимите короткое видео</p>
        </div>

        <div className="relative mb-6">
          {recordedVideo ? (
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-64 object-cover rounded-2xl bg-black"
            />
          ) : (
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              className="w-full h-64 object-cover rounded-2xl bg-black"
            />
          )}
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              REC
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          {!recordedVideo ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex-1 h-12 rounded-xl"
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
                className="flex-1 h-12 rounded-xl"
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
      </Card>
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

        <div className="flex flex-col gap-3">
          <Button 
            onClick={downloadVideo}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            <Icon name="Download" size={20} className="mr-2" />
            Сохранить видео
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

  const screens = [
    renderStartScreen,
    renderImageSelection, 
    renderVideoRecording,
    renderSaveScreen
  ];

  return screens[currentStep]();
};

export default Index;