import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Единственная центральная надпись с пульсацией */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-6xl md:text-8xl font-bold text-blue-university animate-pulse-gentle mb-4 text-center">
          IMPERIA PROMO
        </h1>
        <div className="text-2xl md:text-3xl font-light text-blue-university-dark text-center">
          {Array.from("СОВЕРШЕНСТВО В РАБОТЕ").map((letter, index) => (
            <span
              key={index}
              className="inline-block animate-slide-in opacity-0"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </div>
      
      {/* Кнопка внизу */}
      <div className="w-full flex justify-center">
        <Button 
          onClick={onStart}
          size="lg"
          className="w-full max-w-sm h-16 text-xl font-semibold bg-blue-university hover:bg-blue-university-dark text-white rounded-2xl shadow-lg"
        >
          Новый лид
          <Icon name="ArrowRight" size={24} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;