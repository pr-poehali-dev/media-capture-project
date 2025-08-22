import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div 
      className="flex flex-col justify-end min-h-screen p-6 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
        backgroundSize: 'contain'
      }}
    >
      {/* Эффект свечения поверх изображения */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 w-full h-full animate-shine transform -skew-x-12"></div>
      </div>

      <Button 
        onClick={onStart}
        size="lg"
        className="w-full max-w-sm mx-auto h-16 text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg mb-8 relative z-10"
      >
        Новый лид
        <Icon name="ArrowRight" size={24} className="ml-2" />
      </Button>
    </div>
  );
};

export default StartScreen;