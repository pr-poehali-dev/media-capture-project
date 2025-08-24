import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Современные геометрические элементы фона */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-200 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Сетка для техно-эффекта */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      {/* Заголовок */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-blue-900 animate-pulse-gentle text-center drop-shadow-lg leading-tight">
          IMPERIA PROMO
        </h1>
      </div>
      
      {/* Кнопка внизу */}
      <div className="w-full flex justify-center px-4 pb-8 sm:pb-12">
        <Button 
          onClick={onStart}
          size="lg"
          className="w-full max-w-sm h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-slate-600 hover:bg-slate-700 text-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Новый лид
          <Icon name="ArrowRight" size={20} className="ml-2" />
        </Button>
      </div>
      

    </div>
  );
};

export default StartScreen;