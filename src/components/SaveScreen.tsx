import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface YandexUser {
  email: string;
  name: string;
}

interface SaveScreenProps {
  selectedImage: string | null;
  recordedVideo: string | null;
  yandexUser: YandexUser | null;
  isUploadingToCloud: boolean;
  onDownloadVideo: () => Promise<void>;
  onUploadToYandex: () => Promise<void>;
  onLogoutFromYandex: () => void;
  onShareToTelegram: () => Promise<void>;
  onReset: () => void;
}

const SaveScreen = ({ 
  selectedImage, 
  recordedVideo, 
  yandexUser, 
  isUploadingToCloud,
  onDownloadVideo,
  onUploadToYandex,
  onLogoutFromYandex,
  onShareToTelegram,
  onReset
}: SaveScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-orange-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-orange-primary mb-2">Готово!</h2>
          <p className="text-orange-600">Ваше видео готово к сохранению</p>
        </div>

        {selectedImage && (
          <div className="mb-4">
            <p className="text-sm text-orange-500 mb-2">QR-код:</p>
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {recordedVideo && (
          <div className="mb-6">
            <p className="text-sm text-orange-500 mb-2">Записанное видео:</p>
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {yandexUser && (
          <div className="mb-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="User" size={16} className="text-orange-primary mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-primary">{yandexUser.name}</p>
                  <p className="text-xs text-orange-600">{yandexUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogoutFromYandex}
                className="text-orange-primary hover:text-orange-primary-dark"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onDownloadVideo}
            className="w-full h-12 bg-orange-primary hover:bg-orange-primary-dark text-white rounded-xl"
          >
            <Icon name="Download" size={20} className="mr-2" />
            Сохранить локально
          </Button>

          <Button 
            onClick={onShareToTelegram}
            className="w-full h-12 bg-orange-400 hover:bg-orange-500 text-white rounded-xl"
          >
            <Icon name="Send" size={20} className="mr-2" />
            Отправить в Telegram
          </Button>

          <Button 
            onClick={onUploadToYandex}
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
            onClick={onReset}
            className="w-full h-12 rounded-xl border-orange-primary text-orange-primary hover:bg-orange-50"
          >
            Создать ещё
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaveScreen;