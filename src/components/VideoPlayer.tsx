import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface VideoPlayerProps {
  videoSrc: string;
  onClose: () => void;
  onDownload?: () => void;
  className?: string;
}

const VideoPlayer = ({ videoSrc, onClose, onDownload, className = '' }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => console.log('Playback error:', e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  return (
    <div className={`bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Видео */}
      <div className="relative group">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-auto max-h-[70vh] bg-black"
          playsInline
          controls={false}
          onClick={togglePlay}
        />
        
        {/* Оверлей с кнопками */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={skipBackward}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-12 h-12 p-0"
            >
              <Icon name="SkipBack" size={20} />
            </Button>
            
            <Button
              onClick={togglePlay}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-16 h-16 p-0"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
            </Button>
            
            <Button
              onClick={skipForward}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-12 h-12 p-0"
            >
              <Icon name="SkipForward" size={20} />
            </Button>
          </div>
        </div>

        {/* Кнопка закрытия */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-10 h-10 p-0"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>

      {/* Панель управления */}
      <div className="bg-gray-900 p-4 space-y-3">
        {/* Прогресс бар */}
        <div className="flex items-center gap-3 text-white text-sm">
          <span className="min-w-[40px]">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-700 rounded-lg cursor-pointer"
          />
          <span className="min-w-[40px]">{formatTime(duration)}</span>
        </div>

        {/* Кнопки управления */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Воспроизведение/пауза */}
            <Button
              onClick={togglePlay}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
            </Button>

            {/* Звук */}
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-10 h-10 p-0"
              >
                <Icon name={isMuted ? "VolumeX" : "Volume2"} size={16} />
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Скачивание */}
            {onDownload && (
              <Button
                onClick={onDownload}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 p-0"
                title="Скачать видео"
              >
                <Icon name="Download" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;