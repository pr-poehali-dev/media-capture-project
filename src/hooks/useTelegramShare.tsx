import { type NotebookData } from '@/components/VideoRecording';
import { useState, useRef, useCallback } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useTelegramShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const activeUrlsRef = useRef<Set<string>>(new Set());
  const shareCountRef = useRef(0);
  const lastShareTimeRef = useRef<number>(0);
  const shareToTelegram = useCallback(async (
    recordedVideo: string | null,
    notebookData: NotebookData,
    location: LocationData | null
  ) => {
    if (!recordedVideo) return;
    
    // Rate limiting: не больше 1 отправки в 3 секунды
    const now = Date.now();
    if (now - lastShareTimeRef.current < 3000) {
      alert('⏱️ Подождите немного перед следующей отправкой');
      return;
    }
    
    // Проверка на одновременные отправки
    if (isSharing) {
      alert('📤 Видео уже отправляется, подождите завершения');
      return;
    }
    
    // Лимит на количество отправок без перезагрузки страницы
    shareCountRef.current++;
    if (shareCountRef.current > 10) {
      alert('🔄 Для стабильной работы рекомендуем обновить страницу');
    }
    
    lastShareTimeRef.current = now;
    setIsSharing(true);

    try {
      // Получаем blob видео
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла и конвертируем в MP4 для лучшей совместимости
      let finalBlob = blob;
      let filename = `imperia_video_${new Date().getTime()}.mp4`;
      
      // Для мобильных платформ принудительно используем MP4 формат
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isMobile = isIOS || isAndroid;
      
      if (isMobile && !blob.type.includes('mp4')) {
        // Создаем новый blob с MP4 MIME типом для лучшей совместимости
        finalBlob = new Blob([blob], { type: 'video/mp4' });
      }
      
      // Формируем текст с данными анкеты и геолокацией
      let shareText = 'Видео создано с помощью IMPERIA PROMO 🎬';
      
      if (notebookData.parentName || notebookData.childName || notebookData.age) {
        shareText += '\n\nИнформация о ребенке:';
        if (notebookData.parentName) shareText += `\n👤 Родитель: ${notebookData.parentName}`;
        if (notebookData.childName) shareText += `\n👶 Ребенок: ${notebookData.childName}`;
        if (notebookData.age) shareText += `\n🎂 Возраст: ${notebookData.age}`;
      }
      
      if (location) {
        shareText += '\n\n📍 Место съемки:';
        if (location.address) {
          shareText += `\n${location.address}`;
        }
        shareText += `\n📐 Координаты: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
        shareText += `\n🗺️ Карта: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
      }
      
      // Проверяем доступность Web Share API
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([finalBlob], filename, { type: finalBlob.type });
          
          // Проверяем поддержку файлов
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'IMPERIA PROMO Video',
              text: shareText,
              files: [file]
            });
            return;
          }
        } catch (shareError) {
          console.log('Web Share API недоступен, используем альтернативный метод:', shareError);
          // Продолжаем с альтернативным методом
        }
      }
      
      if (isMobile) {
        // Для мобильных устройств используем Telegram URL схему
        const telegramText = encodeURIComponent(shareText);
        
        // Сначала пробуем открыть Telegram через URL схему
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${telegramText}`;
        
        // Создаем временную ссылку для скачивания файла
        const videoUrl = URL.createObjectURL(finalBlob);
        activeUrlsRef.current.add(videoUrl);
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        
        // Улучшенные инструкции для мобильных платформ
        const instructions = isIOS 
          ? `📱 Отправка видео в Telegram на iPhone:\n\n1. Нажмите "OK" и сохраните видео\n2. Откройте приложение "Файлы" → "Загрузки"\n3. Найдите файл "${filename}"\n4. Нажмите "Поделиться" → выберите Telegram\n5. Выберите чат и отправьте\n\n💡 Или откройте Telegram → чат → 📎 → "Файл" → найдите видео`
          : `📱 Отправка видео в Telegram на Android:\n\n1. Видео будет скачано автоматически\n2. Откройте Telegram → выберите чат\n3. Нажмите 📎 → "Файл"\n4. Найдите "${filename}" в папке "Загрузки"\n5. Выберите файл и отправьте\n\n💡 Размер: ${(finalBlob.size / (1024*1024)).toFixed(1)} МБ`;

        // Показываем инструкции с улучшенной информацией
        if (confirm(instructions + '\n\nНачать скачивание?')) {
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Открываем Telegram только на Android для упрощения процесса
          if (isAndroid) {
            setTimeout(() => {
              window.open(telegramUrl, '_blank');
            }, 1500);
          }
        }

        // Очищаем URL через 2 минуты (сокращено для экономии памяти)
        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
          activeUrlsRef.current.delete(videoUrl);
        }, 120000);

      } else {
        // Для десктопа показываем инструкции
        const videoUrl = URL.createObjectURL(finalBlob);
        activeUrlsRef.current.add(videoUrl);
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Быстро очищаем URL для десктопа
        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
          activeUrlsRef.current.delete(videoUrl);
        }, 1000);

        alert(
          `💻 Отправка в Telegram на компьютере:\n\n` +
          `1. Видео скачано: "${filename}" (${(finalBlob.size / (1024*1024)).toFixed(1)} МБ)\n` +
          `2. Откройте Telegram Web или приложение\n` +
          `3. Выберите чат или канал\n` +
          `4. Перетащите файл в окно чата\n` +
          `5. Добавьте описание из буфера обмена`
        );
        
        // Копируем описание в буфер обмена для удобства
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText).catch(() => {
            console.log('Не удалось скопировать текст в буфер');
          });
        }
      }

    } catch (error) {
      console.error('Ошибка при отправке в Telegram:', error);
      alert(
        `Ошибка при подготовке к отправке в Telegram.\n\n` +
        `Попробуйте:\n` +
        `1. Сохранить видео локально\n` +
        `2. Вручную отправить через Telegram\n\n` +
        `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    } finally {
      setIsSharing(false);
    }
  }, [isSharing]);
  
  // Функция для принудительной очистки памяти
  const clearMemory = useCallback(() => {
    activeUrlsRef.current.forEach(url => {
      URL.revokeObjectURL(url);
    });
    activeUrlsRef.current.clear();
    shareCountRef.current = 0;
  }, []);

  return {
    shareToTelegram,
    isSharing,
    clearMemory
  };
};