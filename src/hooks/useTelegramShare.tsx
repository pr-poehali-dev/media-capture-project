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
      // Получаем blob видео с проверкой на валидность URL
      let blob: Blob;
      
      if (recordedVideo.startsWith('blob:')) {
        const response = await fetch(recordedVideo);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки видео: ${response.status}`);
        }
        blob = await response.blob();
      } else if (recordedVideo.startsWith('data:')) {
        // Если это data URL, конвертируем в blob
        const response = await fetch(recordedVideo);
        blob = await response.blob();
      } else {
        throw new Error('Неподдерживаемый формат видео URL');
      }
      
      // Проверяем размер видео
      if (blob.size === 0) {
        throw new Error('Видеофайл пустой');
      }
      
      if (blob.size > 50 * 1024 * 1024) { // 50MB лимит
        alert('⚠️ Видео слишком большое для отправки в Telegram (>50МБ)');
        return;
      }
      
      // Определяем расширение файла и конвертируем в MP4 для лучшей совместимости
      let finalBlob = blob;
      let filename = `imperia_video_${new Date().getTime()}.mp4`;
      
      // Определяем устройство и платформу
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isMobile = isIOS || isAndroid;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Устанавливаем правильный MIME тип для лучшей совместимости
      if (blob.type === '' || blob.type === 'video/webm' || (isMobile && !blob.type.includes('mp4'))) {
        // Для мобильных устройств и если тип не определен, используем MP4
        finalBlob = new Blob([blob], { type: 'video/mp4' });
      } else if (isSafari && blob.type.includes('webm')) {
        // Safari лучше работает с MP4
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
      
      // Проверяем доступность Web Share API с улучшенной совместимостью
      if (navigator.share && typeof navigator.canShare === 'function') {
        try {
          const file = new File([finalBlob], filename, { 
            type: finalBlob.type,
            lastModified: Date.now()
          });
          
          // Проверяем поддержку файлов
          const canShareFiles = await navigator.canShare({ files: [file] }).catch(() => false);
          
          if (canShareFiles) {
            await navigator.share({
              title: 'IMPERIA PROMO Video',
              text: shareText,
              files: [file]
            });
            
            // Если Web Share API сработал успешно
            alert('✅ Видео успешно передано в выбранное приложение!');
            return;
          } else {
            console.log('Файлы не поддерживаются Web Share API');
          }
        } catch (shareError) {
          console.log('Web Share API ошибка:', shareError);
          // Продолжаем с альтернативным методом
        }
      }
      
      if (isMobile) {
        // Создаем улучшенную ссылку для скачивания
        const videoUrl = URL.createObjectURL(finalBlob);
        activeUrlsRef.current.add(videoUrl);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        
        // Улучшенные инструкции с актуальной информацией
        const sizeText = `${(finalBlob.size / (1024*1024)).toFixed(1)} МБ`;
        const instructions = isIOS 
          ? `📱 Отправка в Telegram/WhatsApp на iPhone:\n\n✅ АВТОМАТИЧЕСКОЕ СКАЧИВАНИЕ:\n1. Видео сохранится в "Файлы" → "Загрузки"\n2. Откройте Telegram/WhatsApp\n3. Выберите чат → 📎 → "Файл"\n4. Найдите "${filename}" (${sizeText})\n5. Отправьте\n\n🔄 ИЛИ ЧЕРЕЗ ПОДЕЛИТЬСЯ:\nФайлы → найдите видео → Поделиться → выберите мессенджер`
          : `📱 Отправка в Telegram/WhatsApp на Android:\n\n✅ ПРОСТОЙ СПОСОБ:\n1. Видео автоматически скачается\n2. Откройте уведомление о загрузке\n3. Нажмите "Поделиться" → выберите мессенджер\n\n📁 ИЛИ ВРУЧНУЮ:\nTelegram/WhatsApp → чат → 📎 → "Файл" → "Загрузки" → "${filename}" (${sizeText})`;

        // Показываем инструкции
        const userConfirmed = confirm(instructions + '\n\nНачать скачивание?');
        
        if (userConfirmed) {
          try {
            // Добавляем в DOM и кликаем
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Показываем уведомление об успехе
            setTimeout(() => {
              alert('📥 Скачивание началось! Проверьте уведомления или папку "Загрузки".');
            }, 500);
            
            // Для Android также пробуем открыть Telegram Web
            if (isAndroid) {
              const telegramText = encodeURIComponent(shareText.substring(0, 200)); // Ограничиваем длину
              const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${telegramText}`;
              
              setTimeout(() => {
                const shouldOpenTelegram = confirm('📱 Открыть Telegram для быстрой отправки?');
                if (shouldOpenTelegram) {
                  window.open(telegramUrl, '_blank');
                }
              }, 2000);
            }
            
          } catch (downloadError) {
            console.error('Ошибка скачивания:', downloadError);
            alert('❌ Ошибка скачивания. Попробуйте еще раз или используйте другой браузер.');
          } finally {
            // Очищаем DOM
            if (downloadLink.parentNode) {
              document.body.removeChild(downloadLink);
            }
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