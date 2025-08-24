import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ImageSelectionProps {
  selectedImage: string | null;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}

const ImageSelection = ({ selectedImage, onImageSelect, onBack, onNext }: ImageSelectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Icon name="QrCode" size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2 drop-shadow-sm">Выберите QR-код</h2>
        </div>

        {selectedImage ? (
          <div className="mb-6 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-48 object-cover rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-blue-university animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-blue-400/40 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mb-6 backdrop-blur-sm bg-blue-50/50"
          >
            <div className="text-center">
              <Icon name="Plus" size={32} className="text-blue-500 mx-auto mb-2" />
              <p className="text-blue-600">Нажмите для выбора</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageSelect}
          accept="image/*"
          className="hidden"
        />

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-12 rounded-xl border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Назад
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedImage}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg disabled:opacity-50"
          >
            Далее
            <Icon name="ArrowRight" size={20} className="ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ImageSelection;