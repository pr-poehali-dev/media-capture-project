import { useState, useRef } from 'react';
import StartScreen from '@/components/StartScreen';
import ImageSelection from '@/components/ImageSelection';
import VideoRecording, { type NotebookData } from '@/components/VideoRecording';
import SaveScreen from '@/components/SaveScreen';

import { useVideoRecording } from '@/hooks/useVideoRecording';
import { useLocation } from '@/hooks/useLocation';
import { useTelegramShare } from '@/hooks/useTelegramShare';


const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notebookData, setNotebookData] = useState<NotebookData>({
    parentName: '',
    childName: '',
    age: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Используем кастомные хуки
  const {
    isRecording,
    recordedVideo,
    videoRef,
    currentCamera,
    availableCameras,
    isPreviewActive,
    startVideoRecording: startRecording,
    stopVideoRecording,
    downloadVideo,
    resetRecording,
    switchCamera,
    startCameraPreview,
    getAvailableCameras
  } = useVideoRecording();

  const {
    location,
    getLocationInfo,
    resetLocation
  } = useLocation();

  const {
    shareToTelegram
  } = useTelegramShare();



  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      event.target.value = '';
      return;
    }

    // Проверяем размер файла (максимум 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Размер изображения слишком большой. Максимум 10MB');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImage(result);
      }
    };
    
    reader.onerror = () => {
      alert('Ошибка при чтении файла. Попробуйте другое изображение');
      event.target.value = '';
    };
    
    reader.readAsDataURL(file);
  };

  const startVideoRecording = async () => {
    // Получаем геолокацию при начале записи
    getLocationInfo();
    // Запускаем запись видео
    await startRecording();
  };

  const resetApp = () => {
    // Очищаем все состояния в правильном порядке
    setSelectedImage(null);
    resetRecording();
    resetLocation();
    // Переходим на первый экран последним
    setCurrentStep(0);
  };

  const handleRetake = () => {
    resetRecording();
    resetLocation();
    setCurrentStep(2);
  };

  const handleShareToTelegram = async () => {
    await shareToTelegram(recordedVideo, notebookData, location);
  };



  const screens = [
    () => <StartScreen onStart={() => setCurrentStep(1)} />,
    () => (
      <ImageSelection 
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
        onBack={() => setCurrentStep(0)}
        onNext={() => setCurrentStep(2)}
      />
    ),
    () => (
      <VideoRecording 
        selectedImage={selectedImage}
        recordedVideo={recordedVideo}
        isRecording={isRecording}
        onBack={() => setCurrentStep(1)}
        onNext={() => setCurrentStep(3)}
        onStartRecording={startRecording}
        onStopRecording={stopVideoRecording}
        onRetake={handleRetake}
        onDownload={downloadVideo}
        videoRef={videoRef}
        notebookData={notebookData}
        onNotebookDataChange={setNotebookData}
        currentCamera={currentCamera}
        availableCameras={availableCameras}
        isPreviewActive={isPreviewActive}
        onSwitchCamera={switchCamera}
        onStartPreview={startCameraPreview}
      />
    ),
    () => (
      <SaveScreen 
        selectedImage={selectedImage}
        recordedVideo={recordedVideo}
        onDownloadVideo={downloadVideo}
        onShareToTelegram={handleShareToTelegram}
        onReset={resetApp}
      />
    )
  ];

  return (
    <>
      {screens[currentStep]()}

    </>
  );
};

export default Index;