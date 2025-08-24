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
  isSharing: boolean;
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
  isSharing,
  onDownloadVideo,
  onUploadToYandex,
  onLogoutFromYandex,
  onShareToTelegram,
  onReset
}: SaveScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-blue-50">
      <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Icon name="CheckCircle" size={24} className="text-green-600 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-university mb-2">Готово!</h2>
          <p className="text-sm sm:text-base text-blue-600">Ваше видео готово к сохранению</p>
        </div>

        {selectedImage && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-blue-500 mb-2">QR-код:</p>
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-24 sm:h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {recordedVideo && (
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-blue-500 mb-2">Записанное видео:</p>
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-24 sm:h-32 object-cover rounded-xl"
            />
          </div>
        )}

        {yandexUser && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="User" size={14} className="text-blue-university mr-2 sm:w-4 sm:h-4" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-university">{yandexUser.name}</p>
                  <p className="text-xs text-blue-600">{yandexUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogoutFromYandex}
                className="text-blue-university hover:text-blue-university-dark p-1 h-auto"
              >
                <Icon name="LogOut" size={14} />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:gap-3">
          <Button 
            onClick={onDownloadVideo}
            className="w-full h-11 sm:h-12 bg-blue-university hover:bg-blue-university-dark text-white rounded-xl text-sm sm:text-base"
          >
            <Icon name="Download" size={18} className="mr-2 sm:w-5 sm:h-5" />
            Сохранить локально
          </Button>

          <Button 
            onClick={onShareToTelegram}
            disabled={isSharing}
            className="w-full h-11 sm:h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 text-sm sm:text-base"
          >
            {isSharing ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin sm:w-5 sm:h-5" />
                Отправляется...
              </>
            ) : (
              <>
                <Icon name="Send" size={18} className="mr-2 sm:w-5 sm:h-5" />
                Отправить в Telegram
              </>
            )}
          </Button>

          <Button 
            onClick={onUploadToYandex}
            disabled={isUploadingToCloud}
            className="w-full h-11 sm:h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 text-sm sm:text-base"
          >
            {isUploadingToCloud ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Cloud" size={18} className="mr-2 sm:w-5 sm:h-5" />
                {yandexUser ? 'Сохранить на Яндекс.Диск' : 'Войти в Яндекс.Диск'}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={onReset}
            className="w-full h-11 sm:h-12 rounded-xl border-blue-university text-blue-university hover:bg-blue-50 text-sm sm:text-base"
          >
            Создать ещё
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaveScreen;