import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Современные геометрические элементы фона */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full blur-3xl animate-pulse-gentle"></div>
      </div>
      
      {/* Модерновые геометрические элементы */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-2 h-32 bg-gradient-to-b from-blue-300 to-transparent rounded-full rotate-12"></div>
        <div className="absolute bottom-32 right-1/3 w-2 h-24 bg-gradient-to-b from-purple-300 to-transparent rounded-full -rotate-12"></div>
        <div className="absolute top-1/2 right-20 w-1 h-20 bg-gradient-to-b from-cyan-300 to-transparent rounded-full rotate-45"></div>
      </div>

      {/* Модерновый заголовок */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
        <div className="relative">
          {/* Декоративные элементы */}
          <div className="absolute -top-8 -left-8 w-16 h-16 border-4 border-blue-200 rounded-lg rotate-12 animate-spin-slow opacity-60"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-3 border-purple-200 rounded-full animate-bounce-slow opacity-60"></div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-blue-900 text-center leading-none relative">
            <span className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent drop-shadow-sm">
              IMPERIA
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent text-3xl sm:text-5xl md:text-7xl font-light tracking-wider">
              PROMO
            </span>
          </h1>
          
          {/* Современные линии */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent transform -translate-y-1/2 opacity-60"></div>
        </div>
        
        {/* Минималистичные иконки */}
        <div className="flex items-center justify-center space-x-8 mt-8 opacity-40">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
      
      {/* Современная кнопка */}
      <div className="w-full flex justify-center px-4 pb-8 sm:pb-12 relative z-10">
        <div className="relative group">
          {/* Свечение при наведении */}
          <div className="absolute -inset-4 bg-gradient-to-r from-slate-600/20 to-slate-800/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Button 
            onClick={onStart}
            size="lg"
            className="relative w-full max-w-sm h-16 text-xl font-bold bg-slate-600 hover:bg-slate-700 text-white rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-slate-500/30 active:scale-95 border border-slate-500/20"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="tracking-wide">Новый лид</span>
              <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg transition-transform duration-300 group-hover:translate-x-1">
                <Icon name="ArrowRight" size={18} className="text-white" />
              </div>
            </div>
            
            {/* Иннер свечение */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;