import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';


interface SaveScreenProps {
  selectedImage: string | null;
  recordedVideo: string | null;
  onDownloadVideo: () => Promise<void>;
  onShareToTelegram: () => Promise<void>;
  onReset: () => void;
}

const SaveScreen = ({ 
  selectedImage, 
  recordedVideo, 
  onDownloadVideo,
  onShareToTelegram,
  onReset
}: SaveScreenProps) => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-university mb-2">Готово!</h2>
          <p className="text-blue-600">Ваше видео готово к сохранению</p>
        </div>

        {selectedImage && (
          <div className="mb-4">
            <p className="text-sm text-blue-500 mb-2">QR-код:</p>
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {recordedVideo && (
          <div className="mb-6">
            <p className="text-sm text-blue-500 mb-2">Записанное видео:</p>
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => { onDownloadVideo(); }}
            className="w-full h-12 bg-blue-university hover:bg-blue-university-dark text-white rounded-xl"
          >
            <Icon name="Download" size={20} className="mr-2" />
            Сохранить локально
          </Button>

          <Button 
            onClick={() => { onShareToTelegram(); }}
            className="w-full h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-xl"
          >
            <Icon name="Send" size={20} className="mr-2" />
            Отправить в Telegram
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => { onReset(); }}
            className="w-full h-12 rounded-xl border-blue-university text-blue-university hover:bg-blue-50"
          >
            Создать ещё
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaveScreen;