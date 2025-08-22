import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div 
      className="flex flex-col justify-between min-h-screen p-6 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
        backgroundSize: 'contain'
      }}
    >
      {/* Логотип с анимацией */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 animate-gradient logo-glow relative overflow-hidden">
            <span className="relative inline-block">
              IMPERIA
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shine pointer-events-none"></div>
            </span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-500 animate-gradient logo-glow relative mt-2 overflow-hidden">
            <span className="relative inline-block">
              PROMO
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shine-delayed pointer-events-none"></div>
            </span>
          </h2>
          <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full animate-glow-pulse"></div>
          
          {/* Дополнительные эффекты свечения */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-gradient-radial from-yellow-400/20 via-blue-400/10 to-transparent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Кнопка */}
      <Button 
        onClick={onStart}
        size="lg"
        className="w-full max-w-sm mx-auto h-16 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg"
      >
        Новый лид
        <Icon name="ArrowRight" size={24} className="ml-2" />
      </Button>


    </div>
  );
};

export default StartScreen;