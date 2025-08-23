import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useSound } from '@/hooks/useSound';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const { playClickSound } = useSound();

  const handleStart = () => {
    playClickSound();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white border-0" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-100">
            <Icon name="Rocket" size={32} className="text-blue-university" />
          </div>
          <h2 className="text-2xl font-bold text-blue-university mb-2">Добро пожаловать!</h2>
          <p className="text-blue-600">Создайте новый лид с QR-кодом и видео</p>
        </div>

        <div className="mb-6">
          <div 
            className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center animate-breathe"
            style={{
              backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          >
          </div>
        </div>

        <Button 
          onClick={handleStart}
          className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Новый лид
          <Icon name="ArrowRight" size={24} className="ml-2" />
        </Button>
      </Card>
    </div>
  );
};

export default StartScreen;