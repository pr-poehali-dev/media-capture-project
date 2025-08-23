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
            {/* Декоративные элементы */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Светящиеся частицы */}
              <div className="absolute top-16 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-32 right-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-16 w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-32 right-8 w-1 h-1 bg-white rounded-full animate-pulse opacity-80" style={{ animationDelay: '3s' }}></div>
              
              {/* Парящие иконки */}
              <div className="absolute top-20 right-16 text-white/40 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute bottom-24 left-12 text-blue-300/50 animate-bounce" style={{ animationDelay: '1.5s' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              
              {/* Градиентный overlay для глубины */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10"></div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleStart}
          className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-indigo-950 via-blue-800 to-cyan-700 hover:from-indigo-900 hover:via-blue-700 hover:to-cyan-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 30%, #0c4a6e 60%, #0891b2 100%)',
            boxShadow: '0 10px 25px rgba(30, 27, 75, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          Новый лид
          <Icon name="ArrowRight" size={24} className="ml-2" />
        </Button>
      </Card>
    </div>
  );
};

export default StartScreen;