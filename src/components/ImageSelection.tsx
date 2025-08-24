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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-blue-50">
      <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Icon name="QrCode" size={24} className="text-blue-university sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-university mb-2">Выберите QR-код</h2>
        </div>

        {selectedImage ? (
          <div className="mb-4 sm:mb-6 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-40 sm:h-48 object-cover rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-blue-university animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 sm:h-48 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-university transition-colors mb-4 sm:mb-6"
          >
            <div className="text-center">
              <Icon name="Plus" size={28} className="text-blue-400 mx-auto mb-2 sm:w-8 sm:h-8" />
              <p className="text-sm sm:text-base text-blue-500">Нажмите для выбора</p>
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

        <div className="flex gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-11 sm:h-12 rounded-xl border-blue-university text-blue-university hover:bg-blue-50 text-sm sm:text-base"
          >
            Назад
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedImage}
            className="flex-1 h-11 sm:h-12 bg-blue-university hover:bg-blue-university-dark text-white rounded-xl text-sm sm:text-base"
          >
            Далее
            <Icon name="ArrowRight" size={18} className="ml-1 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ImageSelection;