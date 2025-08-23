import { Button } from '@/components/ui/button';
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
    <div 
      className="flex flex-col justify-end min-h-screen p-6 bg-cover bg-center bg-no-repeat animate-breathe"
      style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
        backgroundSize: 'contain'
      }}
    >
      <Button 
        onClick={handleStart}
        size="lg"
        className="w-full max-w-sm mx-auto h-16 text-xl font-semibold bg-blue-university hover:bg-blue-university-dark text-white rounded-2xl shadow-lg mb-8"
      >
        Новый лид
        <Icon name="ArrowRight" size={24} className="ml-2" />
      </Button>
    </div>
  );
};

export default StartScreen;