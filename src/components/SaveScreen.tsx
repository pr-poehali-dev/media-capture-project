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
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-blue-50 to-blue-100 p-6 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-university/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-university-light/12 rounded-full blur-3xl translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <Card className="w-full max-w-lg p-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-md border border-blue-200/50">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Icon name="CheckCircle" size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-blue-university mb-3">Лид создан!</h2>
            <p className="text-blue-university-dark/70 font-medium text-lg">Ваше видео готово к сохранению и отправке</p>
          </div>

          {selectedImage && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Icon name="QrCode" size={18} className="text-blue-university mr-2" />
                <p className="font-semibold text-blue-university">QR-код:</p>
              </div>
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-36 object-cover rounded-2xl shadow-lg border border-blue-200"
              />
            </div>
          )}

          {recordedVideo && (
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <Icon name="Video" size={18} className="text-blue-university mr-2" />
                <p className="font-semibold text-blue-university">Записанное видео:</p>
              </div>
              <video 
                src={recordedVideo} 
                controls 
                className="w-full h-36 object-cover rounded-2xl shadow-lg border border-blue-200"
              />
            </div>
          )}

          {yandexUser && (
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-university/8 to-blue-university-light/10 rounded-2xl border border-blue-university/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-university rounded-xl flex items-center justify-center mr-3">
                    <Icon name="User" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-university">{yandexUser.name}</p>
                    <p className="text-sm text-blue-university-dark/70">{yandexUser.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogoutFromYandex}
                  className="text-blue-university hover:text-blue-university-dark hover:bg-blue-university/10 rounded-xl"
                >
                  <Icon name="LogOut" size={18} />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button 
              onClick={onDownloadVideo}
              className="w-full h-14 bg-gradient-to-r from-blue-university to-blue-600 hover:from-blue-university-dark hover:to-blue-700 text-white rounded-2xl shadow-lg shadow-blue-university/25 transition-all duration-300 font-semibold text-lg"
            >
              <Icon name="Download" size={22} className="mr-3" />
              Сохранить локально
            </Button>

            <Button 
              onClick={onShareToTelegram}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 font-semibold text-lg"
            >
              <Icon name="Send" size={22} className="mr-3" />
              Отправить в Telegram
            </Button>

            <Button 
              onClick={onUploadToYandex}
              disabled={isUploadingToCloud}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingToCloud ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Загрузка в облако...
                </>
              ) : (
                <>
                  <Icon name="Cloud" size={22} className="mr-3" />
                  {yandexUser ? 'Сохранить на Яндекс.Диск' : 'Войти в Яндекс.Диск'}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={onReset}
              className="w-full h-14 rounded-2xl border-2 border-blue-university/20 hover:border-blue-university/40 hover:bg-blue-50 transition-all duration-300 font-semibold text-lg text-blue-university"
            >
              <Icon name="Plus" size={22} className="mr-3" />
              Создать новый лид
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SaveScreen;