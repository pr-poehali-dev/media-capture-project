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
          <h1 className="text-6xl md:text-7xl font-bold text-green-500 relative overflow-hidden">
            <span className="relative inline-block">
              IMPERIA
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shine pointer-events-none"></div>
            </span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-green-500 relative mt-2 overflow-hidden">
            <span className="relative inline-block">
              PROMO
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shine pointer-events-none"></div>
            </span>
          </h2>
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