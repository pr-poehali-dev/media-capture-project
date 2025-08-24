import { useCallback } from 'react';
import { NotebookData } from '@/components/VideoRecording';

interface UseLeadSaverProps {
  notebookData: NotebookData;
}

export const useLeadSaver = ({ notebookData }: UseLeadSaverProps) => {
  const saveToICloudDrive = useCallback(async () => {
    try {
      // Формируем данные для сохранения
      const leadData = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU'),
        data: {
          'Имя родителя': notebookData.parentName || 'Не указано',
          'Имя ребенка': notebookData.childName || 'Не указано',
          'Возраст': notebookData.age || 'Не указан',
        }
      };

      // Создаем текстовый контент для файла
      const fileContent = `ДАННЫЕ ЛИДА
==================

Дата создания: ${leadData.date}
Время создания: ${leadData.time}

КАТЕГОРИИ:
----------
${Object.entries(leadData.data)
  .map(([category, value]) => `${category}: ${value}`)
  .join('\n')}

Метки времени (ISO): ${leadData.timestamp}
Источник: Media Capture Project
`;

      // Создаем имя файла с временной меткой
      const fileName = `lead-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.txt`;

      // Создаем Blob с данными
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      
      // Проверяем поддержку File System Access API
      if ('showSaveFilePicker' in window) {
        try {
          // Современный API для сохранения файлов
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'Text files',
              accept: { 'text/plain': ['.txt'] },
            }],
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          
          console.log('Лид сохранен успешно через File System Access API');
          return { success: true, method: 'file-system-api' };
        } catch (error) {
          console.log('File System Access API отклонен пользователем, используем fallback');
        }
      }

      // Fallback: создаем ссылку для скачивания
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Освобождаем память
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log('Лид сохранен через download link');
      return { success: true, method: 'download' };
      
    } catch (error) {
      console.error('Ошибка при сохранении лида:', error);
      return { success: false, error: error as Error };
    }
  }, [notebookData]);

  const saveForTelegramShare = useCallback(async () => {
    // Сохраняем данные перед отправкой в Telegram
    const result = await saveToICloudDrive();
    
    if (result.success) {
      console.log('Данные лида сохранены перед отправкой в Telegram');
      
      // Показываем пользователю уведомление о сохранении
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Лид сохранен', {
          body: 'Данные анкеты сохранены в загрузки',
          icon: '/favicon.ico'
        });
      }
    }
    
    return result;
  }, [saveToICloudDrive]);

  return {
    saveToICloudDrive,
    saveForTelegramShare,
  };
};