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
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Современные геометрические элементы фона */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Сетка для техно-эффекта */}
      <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>

      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-black/20 backdrop-blur-xl border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-green-400/30">
            <Icon name="CheckCircle" size={32} className="text-green-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Готово!</h2>
          <p className="text-blue-200">Ваше видео готово к сохранению</p>
        </div>

        {selectedImage && (
          <div className="mb-4">
            <p className="text-sm text-blue-200 mb-2">QR-код:</p>
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-32 object-cover rounded-xl border border-blue-400/30"
            />
          </div>
        )}

        {recordedVideo && (
          <div className="mb-6">
            <p className="text-sm text-blue-200 mb-2">Записанное видео:</p>
            <video 
              src={recordedVideo} 
              controls 
              className="w-full h-32 object-cover rounded-xl border border-blue-400/30"
            />
          </div>
        )}

        {yandexUser && (
          <div className="mb-4 p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="User" size={16} className="text-blue-300 mr-2" />
                <div>
                  <p className="text-sm font-medium text-white">{yandexUser.name}</p>
                  <p className="text-xs text-blue-200">{yandexUser.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogoutFromYandex}
                className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20"
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
            className="w-full h-12 rounded-xl border-blue-300/50 text-blue-200 hover:bg-blue-500/20 backdrop-blur-sm bg-white/5"
          >
            Создать ещё
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaveScreen;