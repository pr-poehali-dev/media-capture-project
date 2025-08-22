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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-orange-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Icon name="QrCode" size={32} className="text-orange-primary" />
          </div>
          <h2 className="text-2xl font-bold text-orange-primary mb-2">Выберите QR-код</h2>
        </div>

        {selectedImage ? (
          <div className="mb-6 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-48 object-cover rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-orange-primary animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-orange-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-orange-primary transition-colors mb-6"
          >
            <div className="text-center">
              <Icon name="Plus" size={32} className="text-orange-400 mx-auto mb-2" />
              <p className="text-orange-500">Нажмите для выбора</p>
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
            className="flex-1 h-12 rounded-xl border-orange-primary text-orange-primary hover:bg-orange-50"
          >
            Назад
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedImage}
            className="flex-1 h-12 bg-orange-primary hover:bg-orange-primary-dark text-white rounded-xl"
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