import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MobileFileHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

const MobileFileHelp = ({ isVisible, onClose }: MobileFileHelpProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-blue-900">
            Разрешения Android
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <Icon name="Camera" size={16} className="text-blue-500 mt-0.5" />
            <p><strong>"Открыть камеру"</strong> — сделать новое фото</p>
          </div>
          
          <div className="flex items-start gap-3">
            <Icon name="Image" size={16} className="text-blue-500 mt-0.5" />
            <p><strong>"Выбрать из галереи"</strong> — загрузить готовое фото</p>
          </div>
          
          <div className="flex items-start gap-3">
            <Icon name="Settings" size={16} className="text-blue-500 mt-0.5" />
            <div>
              <p><strong>Для Android:</strong></p>
              <p className="text-xs mt-1">1. Разрешите доступ к файлам в браузере</p>
              <p className="text-xs">2. Настройки → Приложения → Браузер → Разрешения</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Icon name="Upload" size={16} className="text-blue-500 mt-0.5" />
            <p>Можете попробовать перетащить изображение в область выбора</p>
          </div>
          
          <div className="flex items-start gap-3">
            <Icon name="RefreshCw" size={16} className="text-blue-500 mt-0.5" />
            <p>Перезагрузите страницу и разрешите доступ при первом запросе</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-xl font-medium"
        >
          Понятно
        </button>
      </Card>
    </div>
  );
};

export default MobileFileHelp;