import { useState } from 'react';

interface YandexUser {
  email: string;
  name: string;
  token?: string;
}

export const useYandexDisk = () => {
  const [yandexUser, setYandexUser] = useState<YandexUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);

  const loginToYandex = async (email: string, password: string) => {
    try {
      // ВАЖНО: В реальном проекте нужно зарегистрировать приложение в Яндекс.Консоли
      // и получить настоящий CLIENT_ID. Пока используем демо-режим.
      
      // Проверяем, что введены данные (для демо)
      if (!email.trim()) {
        throw new Error('Введите ваш email от Яндекс аккаунта');
      }
      
      // Имитируем процесс авторизации с задержкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // В демо-режиме создаем пользователя на основе введенного email
      const userData = {
        email: email,
        name: email.split('@')[0],
        token: 'demo_token_' + Math.random().toString(36).substring(7)
      };
      
      setYandexUser(userData);
      setShowAuthModal(false);
      
      alert(
        `✅ Демо-авторизация успешна!\n\n` +
        `Пользователь: ${userData.name}\n` +
        `Email: ${userData.email}\n\n` +
        `⚠️ ВНИМАНИЕ: Это демо-режим!\n` +
        `В реальном проекте нужно:\n` +
        `1. Зарегистрировать приложение в Яндекс.Консоли\n` +
        `2. Получить CLIENT_ID для OAuth\n` +
        `3. Настроить домен для редиректа`
      );
      
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      alert(`Ошибка авторизации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const logoutFromYandex = () => {
    setYandexUser(null);
    alert('Вы вышли из аккаунта Яндекс');
  };

  const uploadToYandexDisk = async (recordedVideo: string | null) => {
    if (!recordedVideo) return;
    
    // Проверяем авторизацию
    if (!yandexUser || !yandexUser.token) {
      setShowAuthModal(true);
      return;
    }
    
    setIsUploadingToCloud(true);
    
    try {
      // Получаем blob видео
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      
      // Определяем расширение файла
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const filename = `imperia_video_${new Date().getTime()}.${extension}`;
      const folderPath = 'IMPERIA_PROMO_Videos';
      
      // Симулируем загрузку на Яндекс.Диск (демо-режим)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // В реальном проекте здесь был бы код загрузки через Yandex Disk API
      const fileSize = (blob.size / 1024 / 1024).toFixed(2); // размер в МБ
      
      alert(
        `✅ Видео успешно "загружено" на Яндекс.Диск!\n\n` +
        `📁 Папка: "${folderPath}"\n` +
        `📄 Файл: ${filename}\n` +
        `📊 Размер: ${fileSize} МБ\n` +
        `👤 Аккаунт: ${yandexUser.email}\n\n` +
        `⚠️ ДЕМО-РЕЖИМ: Файл не загружен реально\n\n` +
        `Для реальной загрузки нужно:\n` +
        `1. Зарегистрировать приложение в Яндекс.Консоли\n` +
        `2. Получить CLIENT_ID и настроить OAuth\n` +
        `3. Реализовать Yandex Disk API`
      );
      
    } catch (error) {
      console.error('Ошибка загрузки на Яндекс.Диск:', error);
      alert(`Ошибка загрузки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  return {
    yandexUser,
    showAuthModal,
    isUploadingToCloud,
    setShowAuthModal,
    loginToYandex,
    logoutFromYandex,
    uploadToYandexDisk
  };
};