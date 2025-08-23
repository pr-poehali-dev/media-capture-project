import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';


interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {


  const handleStart = () => {
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