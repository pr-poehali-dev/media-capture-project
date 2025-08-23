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
    <div className="flex flex-col items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#ffffff' }}>
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-0" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-100">
            <Icon name="QrCode" size={32} className="text-blue-university" />
          </div>
          <h2 className="text-2xl font-bold text-blue-university mb-2">Выберите QR-код</h2>
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
            className="w-full h-48 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-university transition-colors mb-6"
          >
            <div className="text-center">
              <Icon name="Plus" size={32} className="text-blue-400 mx-auto mb-2" />
              <p className="text-blue-500">Нажмите для выбора</p>
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
            className="flex-1 h-12 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 font-semibold transform hover:scale-105 transition-all duration-200"
          >
            Назад
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedImage}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
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