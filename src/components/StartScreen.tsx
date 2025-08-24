import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Современные геометрические элементы фона */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200 rounded-full blur-3xl animate-pulse-gentle" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Сетка для техно-эффекта */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white border border-gray-200">
        <div className="text-center">
          {/* Иконка */}
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Icon name="Sparkles" size={40} className="text-white" />
          </div>
          
          {/* Заголовок */}
          <h1 className="text-3xl font-black text-blue-900 mb-2 leading-tight">
            <span className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent">
              IMPERIA
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent text-2xl font-light tracking-wider">
              PROMO
            </span>
          </h1>
          
          {/* Подзаголовок */}
          <p className="text-blue-600 mb-8 text-base">
            Профессиональные видео-визитки
            <br />
            для социальных сетей
          </p>
          
          {/* Декоративные точки */}
          <div className="flex items-center justify-center space-x-4 mb-8 opacity-40">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Кнопка */}
          <div className="relative group">
            {/* Свечение при наведении */}
            <div className="absolute -inset-2 bg-gradient-to-r from-slate-600/20 to-slate-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <Button 
              onClick={onStart}
              size="lg"
              className="relative w-full h-14 text-lg font-bold bg-slate-600 hover:bg-slate-700 text-white rounded-xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-slate-500/30 active:scale-95"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="tracking-wide">Новый лид</span>
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="ArrowRight" size={18} className="text-white" />
                </div>
              </div>
              
              {/* Внутреннее свечение */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StartScreen;