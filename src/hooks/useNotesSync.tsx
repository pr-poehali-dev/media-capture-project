import { useEffect } from 'react';
import { type NotebookData } from '@/components/VideoRecording';

interface UseNotesSyncProps {
  notebookData: NotebookData;
  enabled?: boolean;
}

export function useNotesSync({ notebookData, enabled = true }: UseNotesSyncProps) {
  useEffect(() => {
    if (!enabled) return;

    // Проверяем, есть ли данные для сохранения
    const hasData = notebookData.parentName || notebookData.childName || notebookData.age;
    if (!hasData) return;

    // Формируем текст для заметок
    const noteText = formatNoteText(notebookData);
    
    // Сохраняем в заметки устройства
    saveToDeviceNotes(noteText);
  }, [notebookData, enabled]);

  const formatNoteText = (data: NotebookData): string => {
    const timestamp = new Date().toLocaleString('ru-RU');
    let noteText = `📝 Данные анкеты - ${timestamp}\n\n`;
    
    if (data.parentName) {
      noteText += `👤 Родитель: ${data.parentName}\n`;
    }
    
    if (data.childName) {
      noteText += `👶 Ребенок: ${data.childName}\n`;
    }
    
    if (data.age) {
      noteText += `🎂 Возраст: ${data.age}\n`;
    }
    
    noteText += '\n---\nСоздано в приложении VideoNotebook';
    return noteText;
  };

  const saveToDeviceNotes = async (noteText: string) => {
    try {
      // Проверяем поддержку Web Share API
      if (navigator.share) {
        // Для мобильных устройств используем Web Share API
        await navigator.share({
          title: 'Данные анкеты',
          text: noteText
        });
        return;
      }

      // Для iOS - используем URL Scheme для Notes
      if (isIOS()) {
        const encodedText = encodeURIComponent(noteText);
        const notesUrl = `mobilenotes://new?noteText=${encodedText}`;
        window.open(notesUrl, '_blank');
        return;
      }

      // Для Android - создаем Intent
      if (isAndroid()) {
        const encodedText = encodeURIComponent(noteText);
        const intent = `intent://new?text=${encodedText}#Intent;scheme=content;package=com.google.android.keep;end`;
        window.location.href = intent;
        return;
      }

      // Fallback - копируем в буфер обмена
      await copyToClipboard(noteText);
      showNotification('Данные скопированы в буфер обмена. Вставьте их в заметки вручную.');

    } catch (error) {
      console.warn('Не удалось сохранить в заметки:', error);
      // Тихий fallback - пробуем скопировать в буфер
      try {
        await copyToClipboard(noteText);
      } catch {
        // Ничего не делаем, чтобы не мешать пользователю
      }
    }
  };

  const isIOS = (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isAndroid = (): boolean => {
    return /Android/.test(navigator.userAgent);
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const showNotification = (message: string): void => {
    // Создаем простое уведомление
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Возвращаем функцию для ручного сохранения
  return {
    saveManually: () => {
      const noteText = formatNoteText(notebookData);
      saveToDeviceNotes(noteText);
    }
  };
}