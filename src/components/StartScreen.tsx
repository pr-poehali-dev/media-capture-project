import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Современные геометрические элементы фона */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Сетка для техно-эффекта */}
      <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
      {/* Единственная центральная надпись с пульсацией */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-6xl md:text-8xl font-bold text-white animate-pulse-gentle mb-4 text-center drop-shadow-2xl">
          IMPERIA PROMO
        </h1>
        <div className="text-2xl md:text-3xl font-light text-blue-200 text-center animate-fade-in opacity-90">
          СОВЕРШЕНСТВО В РАБОТЕ
        </div>
      </div>
      
      {/* Кнопка внизу */}
      <div className="w-full flex justify-center">
        <Button 
          onClick={onStart}
          size="lg"
          className="w-full max-w-sm h-16 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl border border-blue-400/30 backdrop-blur-sm"
        >
          Новый лид
          <Icon name="ArrowRight" size={24} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;