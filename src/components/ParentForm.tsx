import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import useNotesSync from '@/hooks/useNotesSync';

interface FormData {
  parentName: string;
  childName: string;
  childAge: string;
  phone: string;
  email: string;
}

interface ParentFormProps {
  onBack: () => void;
  onNext: () => void;
}

const ParentForm = ({ onBack, onNext }: ParentFormProps) => {
  const { autoSave, isMobile } = useNotesSync();
  
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    childName: '',
    childAge: '',
    phone: '',
    email: ''
  });

  const [isValid, setIsValid] = useState(false);

  // Проверка валидности формы
  useEffect(() => {
    const required = formData.parentName && formData.childName && formData.childAge;
    setIsValid(!!required);
  }, [formData]);

  // Автосохранение при изменении данных
  useEffect(() => {
    const hasRequiredData = formData.parentName || formData.childName || formData.childAge;
    
    if (hasRequiredData && isMobile) {
      const timer = setTimeout(() => {
        autoSave(formData, 'Данные семьи');
      }, 1000); // Задержка 1 секунда после ввода

      return () => clearTimeout(timer);
    }
  }, [formData, autoSave, isMobile]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgeChange = (value: string) => {
    // Разрешаем только цифры
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '' || (parseInt(numericValue) >= 0 && parseInt(numericValue) <= 18)) {
      handleInputChange('childAge', numericValue);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Icon name="Users" size={32} className="text-blue-university" />
          </div>
          <h2 className="text-2xl font-bold text-blue-university mb-2">Данные семьи</h2>
          {isMobile && (
            <p className="text-sm text-blue-600">Данные автоматически сохраняются в заметки</p>
          )}
        </div>

        <div className="space-y-6">
          {/* Имя родителя */}
          <div>
            <Label htmlFor="parentName" className="text-blue-800 font-medium mb-2 block">
              Имя родителя *
            </Label>
            <Input
              id="parentName"
              type="text"
              value={formData.parentName}
              onChange={(e) => handleInputChange('parentName', e.target.value)}
              placeholder="Введите ваше имя"
              className="h-12 rounded-xl border-blue-200 focus:border-blue-university focus:ring-blue-university"
            />
          </div>

          {/* Имя ребенка */}
          <div>
            <Label htmlFor="childName" className="text-blue-800 font-medium mb-2 block">
              Имя ребенка *
            </Label>
            <Input
              id="childName"
              type="text"
              value={formData.childName}
              onChange={(e) => handleInputChange('childName', e.target.value)}
              placeholder="Введите имя ребенка"
              className="h-12 rounded-xl border-blue-200 focus:border-blue-university focus:ring-blue-university"
            />
          </div>

          {/* Возраст ребенка */}
          <div>
            <Label htmlFor="childAge" className="text-blue-800 font-medium mb-2 block">
              Возраст ребенка *
            </Label>
            <Input
              id="childAge"
              type="text"
              inputMode="numeric"
              value={formData.childAge}
              onChange={(e) => handleAgeChange(e.target.value)}
              placeholder="Возраст (0-18 лет)"
              className="h-12 rounded-xl border-blue-200 focus:border-blue-university focus:ring-blue-university"
            />
          </div>

          {/* Телефон (необязательно) */}
          <div>
            <Label htmlFor="phone" className="text-blue-800 font-medium mb-2 block">
              Телефон
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+7 (900) 123-45-67"
              className="h-12 rounded-xl border-blue-200 focus:border-blue-university focus:ring-blue-university"
            />
          </div>

          {/* Email (необязательно) */}
          <div>
            <Label htmlFor="email" className="text-blue-800 font-medium mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@mail.ru"
              className="h-12 rounded-xl border-blue-200 focus:border-blue-university focus:ring-blue-university"
            />
          </div>
        </div>

        {/* Индикатор автосохранения */}
        {isMobile && (formData.parentName || formData.childName || formData.childAge) && (
          <div className="flex items-center justify-center mt-4 text-green-600">
            <Icon name="Check" size={16} className="mr-1" />
            <span className="text-sm">Сохранено в заметки</span>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-12 rounded-xl border-blue-university text-blue-university hover:bg-blue-50"
          >
            Назад
          </Button>
          <Button 
            onClick={onNext}
            disabled={!isValid}
            className="flex-1 h-12 bg-blue-university hover:bg-blue-university-dark text-white rounded-xl disabled:opacity-50"
          >
            Далее
            <Icon name="ArrowRight" size={20} className="ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ParentForm;