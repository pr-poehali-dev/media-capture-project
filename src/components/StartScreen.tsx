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
      {/* Единственная центральная надпись с пульсацией */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-blue-900 animate-pulse-gentle mb-2 sm:mb-4 text-center drop-shadow-lg leading-tight">
          IMPERIA PROMO
        </h1>
        <div className="text-lg sm:text-2xl md:text-3xl font-light text-blue-700 text-center animate-fade-in opacity-90">
          СОВЕРШЕНСТВО В РАБОТЕ
        </div>
      </div>
      
      {/* Кнопка внизу */}
      <div className="w-full flex justify-center px-4">
        <Button 
          onClick={onStart}
          size="lg"
          className="w-full max-w-sm h-14 sm:h-16 relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 text-white font-bold text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center">
            Новый лид
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </span>
          <div className="absolute inset-0 border border-gray-600/50 rounded-2xl" />
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;