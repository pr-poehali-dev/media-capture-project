import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div 
      className="flex flex-col justify-between min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
        backgroundSize: 'contain'
      }}
    >
      {/* Заголовок с анимацией */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white text-center leading-tight">
          <div className="relative inline-block overflow-hidden">
            <span className="relative inline-block animate-shimmer bg-gradient-to-r from-transparent via-silver to-transparent bg-[length:200%_100%] bg-clip-text text-transparent">
              ВИДЕО
            </span>
          </div>
          <br />
          <div className="relative inline-block overflow-hidden">
            <span className="relative inline-block animate-shimmer-delayed bg-gradient-to-r from-transparent via-silver to-transparent bg-[length:200%_100%] bg-clip-text text-transparent">
              КОНСАЛТИНГ
            </span>
          </div>
        </h1>
      </div>

      <Button 
        onClick={onStart}
        size="lg"
        className="w-full max-w-sm mx-auto h-16 text-xl font-semibold bg-blue-university hover:bg-blue-university-dark text-white rounded-2xl shadow-lg"
      >
        Новый лид
        <Icon name="ArrowRight" size={24} className="ml-2" />
      </Button>
    </div>
  );
};

export default StartScreen;