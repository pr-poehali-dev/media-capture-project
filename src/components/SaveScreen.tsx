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
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Современные геометрические элементы фона */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Сетка для техно-эффекта */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-blue-200/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Icon name="CheckCircle" size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2 drop-shadow-sm">Готово!</h2>
          <p className="text-blue-600">Ваше видео готово к сохранению</p>
        </div>

        {selectedImage && (
          <div className="mb-4">
            <p className="text-sm text-blue-600 mb-2">QR-код:</p>
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-32 object-cover rounded-xl border border-blue-200/50"
            />
          </div>
        )}

        {recordedVideo && (
          <div className="mb-6">
            <p className="text-sm text-blue-600 mb-2">Записанное видео:</p>
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-32 object-cover rounded-xl border border-blue-200/50"
            />
          </div>
        )}

        {yandexUser && (
          <div className="mb-4 p-3 bg-blue-100/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="User" size={16} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{yandexUser.name}</p>
                  <p className="text-xs text-blue-600">{yandexUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogoutFromYandex}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onDownloadVideo}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg border border-blue-400/30 backdrop-blur-sm"
          >
            <Icon name="Download" size={20} className="mr-2" />
            Сохранить локально
          </Button>

          <Button 
            onClick={onShareToTelegram}
            disabled={isSharing}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50 shadow-lg border border-green-400/30 backdrop-blur-sm"
          >
            {isSharing ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Отправляется...
              </>
            ) : (
              <>
                <Icon name="Send" size={20} className="mr-2" />
                Отправить в Telegram
              </>
            )}
          </Button>

          <Button 
            onClick={onUploadToYandex}
            disabled={isUploadingToCloud}
            className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl disabled:opacity-50 shadow-lg border border-orange-400/30 backdrop-blur-sm"
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
            className="w-full h-12 rounded-xl border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Создать ещё
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaveScreen;