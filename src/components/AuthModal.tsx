import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onClose: () => void;
}

const AuthModal = ({ onLogin, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Введите email от Яндекс аккаунта');
      return;
    }
    
    setIsLogging(true);
    await onLogin(email, password);
    setIsLogging(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm p-6 bg-white rounded-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
            <Icon name="User" size={24} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Демо-вход в Яндекс</h3>
          <p className="text-gray-600 text-sm">Введите ваш Yandex email для демо-авторизации</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Yandex Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@yandex.ru"
              className="mt-1 h-12 rounded-xl"
              disabled={isLogging}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Пароль (необязательно)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (для демо)"
              className="mt-1 h-12 rounded-xl"
              disabled={isLogging}
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ Это демо-версия. В реальном проекте используется OAuth 2.0
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLogging}
              className="flex-1 h-12 rounded-xl"
            >
              Отмена
            </Button>
            <Button
              type="submit"
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
                  Демо-вход
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthModal;