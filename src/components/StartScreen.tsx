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
    <div className="flex flex-col items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#ffffff' }}>
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-0" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div className="mb-8">
          <div 
            className="w-full h-80 rounded-2xl flex items-center justify-center animate-breathe relative overflow-hidden"
            style={{
              backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          >
            {/* Анимированные геометрические линии */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Плавающие линии */}
              <div className="absolute top-10 left-5 w-20 h-0.5 bg-white opacity-30 animate-float-line"></div>
              <div className="absolute top-16 right-8 w-16 h-0.5 bg-blue-200 opacity-40 animate-drift-line"></div>
              <div className="absolute bottom-20 left-10 w-24 h-0.5 bg-white opacity-25 animate-float-line" style={{ animationDelay: '1s' }}></div>
              
              {/* Вертикальные линии */}
              <div className="absolute top-8 right-12 w-0.5 h-16 bg-blue-100 opacity-35 animate-drift-line" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-16 left-16 w-0.5 h-20 bg-white opacity-30 animate-float-line" style={{ animationDelay: '3s' }}></div>
              
              {/* Диагональные линии */}
              <div className="absolute top-12 left-20 w-12 h-0.5 bg-blue-200 opacity-40 rotate-45 animate-drift-line" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-24 right-16 w-14 h-0.5 bg-white opacity-35 -rotate-45 animate-float-line" style={{ animationDelay: '2.5s' }}></div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleStart}
          className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200"
        >
          Новый лид
          <Icon name="ArrowRight" size={24} className="ml-2" />
        </Button>
      </Card>
    </div>
  );
};

export default StartScreen;