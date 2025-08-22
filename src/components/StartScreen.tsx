import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Современный синий градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-university via-blue-600 to-blue-800"></div>
      
      {/* Декоративные геометрические формы */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-university-light/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-300/30 rounded-full blur-2xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-university-dark/25 rounded-full blur-3xl translate-y-1/2"></div>
      </div>
      
      {/* Основной контент */}
      <div 
        className="relative flex flex-col justify-center items-center min-h-screen p-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/files/0ccd0fdd-93aa-41f8-ad8d-66467510a595.jpeg')`,
          backgroundSize: 'contain',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Заголовок */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl">
            Lead<span className="text-blue-200">Gen</span>
          </h1>
          <p className="text-xl text-blue-100 font-medium drop-shadow-lg">
            Создание лидов нового поколения
          </p>
        </div>

        {/* Основная кнопка */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-blue-university-light rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <Button 
            onClick={onStart}
            size="lg"
            className="relative w-full max-w-sm h-20 text-2xl font-bold bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
              <span>Новый лид</span>
              <Icon name="ArrowRight" size={28} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-blue-200/80 text-sm font-medium">
            Нажмите для начала создания
          </p>
        </div>
      </div>
      
      {/* Анимированные частицы */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/60 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-blue-university-light/80 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-blue-200/40 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-400/70 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default StartScreen;