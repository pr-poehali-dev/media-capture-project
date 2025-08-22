import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onClose: () => void;
}

const AuthModal = ({ onLogin, onClose }: AuthModalProps) => {
  const [isLogging, setIsLogging] = useState(false);

  const handleLogin = async () => {
    setIsLogging(true);
    await onLogin('', ''); // OAuth не требует email/пароль
    setIsLogging(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm p-6 bg-white rounded-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
            <Icon name="User" size={24} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Вход в Яндекс</h3>
          <p className="text-gray-600 text-sm">Войдите для сохранения видео на Яндекс.Диск</p>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm mb-4">
            Нажмите кнопку ниже, чтобы безопасно войти через Яндекс OAuth
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLogging}
            className="flex-1 h-12 rounded-xl"
          >
            Отмена
          </Button>
          <Button
            onClick={handleLogin}
            disabled={isLogging}
            className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            {isLogging ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Авторизация...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти через Яндекс
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;