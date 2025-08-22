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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Icon name="Image" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите QR код</h2>

        </div>

        {selectedImage ? (
          <div className="mb-6 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-48 object-cover rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.6),inset_0_0_20px_rgba(34,197,94,0.2)]"></div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors mb-6"
          >
            <div className="text-center">
              <Icon name="Plus" size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Нажмите для выбора</p>
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
            className="flex-1 h-12 rounded-xl"
          >
            Назад
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedImage}
            className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
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