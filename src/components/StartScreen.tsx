import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-blue-university animate-pulse-gentle mb-8 text-center">
            IMPERIA PROMO
          </h1>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={onStart}
            size="lg"
            className="flex-1 h-16 text-xl font-semibold bg-blue-university hover:bg-blue-university-dark text-white rounded-2xl shadow-lg"
          >
            Новый лид
            <Icon name="ArrowRight" size={24} className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StartScreen;