import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const playClickSound = useCallback(async () => {
    try {
      // Создаём AudioContext только один раз
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Возобновляем контекст, если он был приостановлен
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const createTone = (frequency: number, duration: number, volume: number = 0.1) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };
      
      // Мелодичный звук клика - арпеджио до-мажор
      createTone(523, 0.15, 0.04); // До (C5)
      setTimeout(() => createTone(659, 0.12, 0.03), 80); // Ми (E5)  
      setTimeout(() => createTone(784, 0.18, 0.025), 140); // Соль (G5)
      
    } catch (error) {
      // Игнорируем ошибки звука, чтобы не блокировать UI
      console.warn('Sound playback failed:', error);
    }
  }, []);

  return { playClickSound };
};