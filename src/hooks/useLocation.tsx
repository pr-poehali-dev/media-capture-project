import { useState } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);

  const getLocationInfo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Получаем адрес через обратное геокодирование (OpenStreetMap Nominatim API)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            
            setLocation({ latitude, longitude, address });
          } catch (error) {
            console.error('Ошибка получения адреса:', error);
            setLocation({ latitude, longitude, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` });
          }
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const resetLocation = () => {
    setLocation(null);
  };

  return {
    location,
    getLocationInfo,
    resetLocation
  };
};