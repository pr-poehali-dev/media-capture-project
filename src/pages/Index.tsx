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
    startVideoRecording: startRecording,
    stopVideoRecording,
    downloadVideo,
    resetRecording
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
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        onStartRecording={startVideoRecording}
        onStopRecording={stopVideoRecording}
        onRetake={handleRetake}
        videoRef={videoRef}
        notebookData={notebookData}
        onNotebookDataChange={setNotebookData}
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