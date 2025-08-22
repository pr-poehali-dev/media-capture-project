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
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-blue-50 to-blue-100 p-6 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-blue-university/10 rounded-full blur-3xl translate-x-1/3"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-university-light/15 rounded-full blur-3xl -translate-x-1/3"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <Card className="w-full max-w-lg p-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-md border border-blue-200/50">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-university to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Icon name="QrCode" size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-blue-university mb-3">Выберите QR-код</h2>
            <p className="text-blue-university-dark/70 font-medium">Загрузите изображение для создания лида</p>
          </div>

          {selectedImage ? (
            <div className="mb-8 relative">
              <div className="relative rounded-3xl overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full h-56 object-cover rounded-3xl shadow-xl"
                />
                <div className="absolute inset-0 rounded-3xl border-4 border-blue-university animate-pulse shadow-[0_0_30px_rgba(68,114,202,0.6),inset_0_0_30px_rgba(68,114,202,0.2)]"></div>
                <div className="absolute top-4 right-4 bg-blue-university text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Готово
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-56 border-3 border-dashed border-blue-university/30 rounded-3xl flex items-center justify-center cursor-pointer hover:border-blue-university hover:bg-blue-university/5 transition-all duration-300 mb-8 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-university/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-university/20 transition-colors">
                  <Icon name="Upload" size={32} className="text-blue-university" />
                </div>
                <p className="text-blue-university font-semibold text-lg">Нажмите для выбора</p>
                <p className="text-blue-university-dark/60 text-sm mt-1">Поддерживаются JPG, PNG</p>
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

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1 h-14 rounded-2xl border-2 border-blue-university/20 hover:border-blue-university/40 hover:bg-blue-50 transition-all duration-300 font-semibold text-lg"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <Button 
              onClick={onNext}
              disabled={!selectedImage}
              className="flex-1 h-14 bg-gradient-to-r from-blue-university to-blue-600 hover:from-blue-university-dark hover:to-blue-700 text-white rounded-2xl shadow-xl shadow-blue-university/30 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageSelection;