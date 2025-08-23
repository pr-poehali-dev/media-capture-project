import { useCallback } from 'react';

export const useSound = () => {
  const playClickSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
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
    
  }, []);

  return { playClickSound };
};