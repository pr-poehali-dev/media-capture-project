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
            {/* Анимированные извивающиеся линии */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Длинные плавающие линии */}
              <div className="absolute top-8 left-2 w-40 h-1 bg-gradient-to-r from-white to-blue-200 opacity-30 animate-float-line rounded-full"></div>
              <div className="absolute top-20 right-4 w-36 h-1 bg-gradient-to-l from-blue-300 to-transparent opacity-40 animate-drift-line rounded-full"></div>
              <div className="absolute bottom-24 left-6 w-44 h-1 bg-gradient-to-r from-transparent via-white to-blue-100 opacity-25 animate-float-line rounded-full" style={{ animationDelay: '1s' }}></div>
              
              {/* Длинные вертикальные извивающиеся линии */}
              <div className="absolute top-4 right-8 w-1 h-32 bg-gradient-to-b from-blue-200 to-white opacity-35 animate-drift-line rounded-full" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-8 left-12 w-1 h-36 bg-gradient-to-t from-white via-blue-100 to-transparent opacity-30 animate-float-line rounded-full" style={{ animationDelay: '3s' }}></div>
              
              {/* Длинные диагональные извивающиеся линии */}
              <div className="absolute top-16 left-16 w-28 h-1 bg-gradient-to-r from-blue-300 via-white to-blue-200 opacity-40 animate-drift-line rounded-full" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-32 right-12 w-32 h-1 bg-gradient-to-l from-white via-blue-100 to-transparent opacity-35 animate-float-line rounded-full" style={{ animationDelay: '2.5s' }}></div>
              
              {/* Дополнительные извивающиеся элементы */}
              <div className="absolute top-32 left-20 w-24 h-1 bg-gradient-to-r from-transparent to-blue-200 opacity-20 animate-drift-line rounded-full" style={{ animationDelay: '4s' }}></div>
              <div className="absolute bottom-16 right-20 w-28 h-1 bg-gradient-to-l from-white to-blue-300 opacity-30 animate-float-line rounded-full" style={{ animationDelay: '0.5s' }}></div>
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