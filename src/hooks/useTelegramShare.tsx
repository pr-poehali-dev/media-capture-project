import { type NotebookData } from '@/components/VideoRecording';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useTelegramShare = () => {
  const shareToTelegram = async (
    recordedVideo: string | null,
    notebookData: NotebookData,
    location: LocationData | null
  ) => {
    if (!recordedVideo) return;

    try {
      // Получаем blob видео
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const filename = `imperia_video_${new Date().getTime()}.${extension}`;
      
      // Формируем текст с данными блокнота и геолокацией
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
          const file = new File([blob], filename, { type: blob.type });
          
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
          console.log('Web Share API недоступен:', shareError);
        }
      }

      // Определяем платформу и браузер
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isMobile = isIOS || isAndroid;
      
      if (isMobile) {
        // Для мобильных устройств используем Telegram URL схему
        const telegramText = encodeURIComponent(shareText);
        
        // Сначала пробуем открыть Telegram через URL схему
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${telegramText}`;
        
        // Создаем временную ссылку для скачивания файла
        const videoUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        
        // Показываем инструкции пользователю
        const instructions = isIOS 
          ? `📱 Для отправки видео в Telegram на iPhone:\n\n1. Сначала сохраните видео в галерею:\n   • Нажмите "Сохранить локально"\n   • Следуйте инструкциям для сохранения\n\n2. Затем откройте Telegram:\n   • Выберите чат или канал\n   • Нажмите 📎 (прикрепить)\n   • Выберите "Фото и видео"\n   • Выберите сохраненное видео\n\n3. Добавьте описание: "Видео создано с IMPERIA PROMO 🎬"`
          : `📱 Для отправки видео в Telegram на Android:\n\n1. Скачайте видео (автоматически начнется)\n2. Откройте Telegram\n3. Выберите чат или канал\n4. Нажмите 📎 → Файл\n5. Найдите файл "${filename}"\n6. Добавьте описание: "Видео создано с IMPERIA PROMO 🎬"`;

        alert(instructions);

        // Автоматически скачиваем файл на Android
        if (isAndroid) {
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }

        // Открываем Telegram для добавления описания
        setTimeout(() => {
          window.open(telegramUrl, '_blank');
        }, 1000);

        // Очищаем URL через 5 минут
        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
        }, 300000);

      } else {
        // Для десктопа показываем инструкции
        const videoUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = filename;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
        }, 100);

        alert(
          `💻 Для отправки в Telegram Web:\n\n` +
          `1. Видео скачано: "${filename}"\n` +
          `2. Откройте Telegram Web или приложение\n` +
          `3. Выберите чат или канал\n` +
          `4. Перетащите файл в окно чата\n` +
          `5. Добавьте описание: "Видео создано с IMPERIA PROMO 🎬"`
        );
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
    }
  };

  return {
    shareToTelegram
  };
};