import { useCallback } from 'react';

interface FormData {
  [key: string]: string | number | boolean;
}

interface DeviceNotesAPI {
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
}

// Утилиты для работы с заметками на мобильных устройствах
const useNotesSync = () => {
  
  // Определяем платформу
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;

  // Форматируем данные формы в читаемый текст
  const formatFormData = useCallback((data: FormData, title: string = 'Анкета'): string => {
    const timestamp = new Date().toLocaleString('ru-RU');
    let content = `${title}\nВремя заполнения: ${timestamp}\n\n`;
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        const fieldName = formatFieldName(key);
        content += `${fieldName}: ${value}\n`;
      }
    });
    
    return content;
  }, []);

  // Преобразуем системные имена полей в человекочитаемые
  const formatFieldName = useCallback((fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      'name': 'Имя',
      'surname': 'Фамилия',
      'email': 'Email',
      'phone': 'Телефон',
      'company': 'Компания',
      'position': 'Должность',
      'experience': 'Опыт работы',
      'skills': 'Навыки',
      'education': 'Образование',
      'comments': 'Комментарии',
      'interests': 'Интересы',
      'source': 'Источник',
      'budget': 'Бюджет',
      'timeline': 'Сроки',
      'requirements': 'Требования'
    };
    
    return fieldNames[fieldName] || fieldName;
  }, []);

  // Основная функция сохранения в заметки
  const saveToNotes = useCallback(async (formData: FormData, title: string = 'Анкета') => {
    if (!isMobile) {
      console.log('Автосохранение в заметки доступно только на мобильных устройствах');
      return;
    }

    const noteContent = formatFormData(formData, title);
    const noteTitle = `${title} - ${new Date().toLocaleDateString('ru-RU')}`;

    try {
      if (isIOS) {
        await saveToiOSNotes(noteTitle, noteContent);
      } else if (isAndroid) {
        await saveToAndroidNotes(noteTitle, noteContent);
      }
    } catch (error) {
      console.error('Ошибка сохранения в заметки:', error);
      // Fallback: копируем в буфер обмена
      await copyToClipboard(noteContent);
    }
  }, [formatFormData, isIOS, isAndroid, isMobile]);

  // Сохранение в заметки iOS
  const saveToiOSNotes = useCallback(async (title: string, content: string) => {
    // Для iOS используем Notes URL Scheme
    const notesURL = `notes://new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(content)}`;
    
    // Пробуем открыть приложение "Заметки"
    if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
      window.open(notesURL, '_blank');
    } else {
      // Fallback: используем Share API
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: content
        });
      }
    }
  }, []);

  // Сохранение в заметки Android
  const saveToAndroidNotes = useCallback(async (title: string, content: string) => {
    // Для Android используем Intent или Share API
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: content
      });
    } else {
      // Создаем ссылку для открытия заметок через Intent
      const intent = `intent://note/create?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}#Intent;scheme=note;package=com.google.android.keep;end`;
      window.open(intent, '_blank');
    }
  }, []);

  // Копирование в буфер обмена как fallback
  const copyToClipboard = useCallback(async (content: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        // Показать уведомление пользователю
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    } catch (error) {
      console.error('Ошибка копирования в буфер обмена:', error);
    }
  }, []);

  // Автосохранение с debounce
  const autoSave = useCallback(async (formData: FormData, title?: string) => {
    // Проверяем, что форма не пустая
    const hasData = Object.values(formData).some(value => 
      value !== '' && value !== null && value !== undefined
    );
    
    if (hasData) {
      await saveToNotes(formData, title);
    }
  }, [saveToNotes]);

  return {
    saveToNotes,
    autoSave,
    isMobile,
    isIOS,
    isAndroid,
    formatFormData
  };
};

export default useNotesSync;