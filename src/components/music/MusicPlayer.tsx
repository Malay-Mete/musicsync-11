
import { useEffect, useRef, useState } from 'react';
import { useMusic } from '@/context/MusicContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Maximize2,
  Minimize2,
  List
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume,
    nextSong,
    prevSong,
    queue,
    favorites,
    addToFavorites,
    removeFromFavorites
  } = useMusic();
  
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const progressInterval = useRef<number | null>(null);
  
  const isFavorite = currentSong ? favorites.some(fav => fav.id === currentSong.id) : false;
  
  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }
    
    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (currentSong && playerRef.current) {
      playerRef.current.loadVideoById(currentSong.id);
      
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [currentSong]);
  
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
        
        // Start progress tracking
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
        
        progressInterval.current = window.setInterval(() => {
          if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();
            setCurrentTime(currentTime);
            setDuration(duration);
            setProgress((currentTime / duration) * 100);
          }
        }, 1000);
      } else {
        playerRef.current.pauseVideo();
        
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);
  
  const initializePlayer = () => {
    if (!iframeRef.current) return;
    
    playerRef.current = new window.YT.Player(iframeRef.current, {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };
  
  const onPlayerReady = (event: YT.PlayerEvent) => {
    event.target.setVolume(volume);
  };
  
  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      nextSong();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleProgressChange = (value: number[]) => {
    if (playerRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      playerRef.current.seekTo(newTime, true);
      setProgress(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume || 50);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };
  
  const handleToggleFavorite = () => {
    if (!currentSong) return;
    
    if (isFavorite) {
      removeFromFavorites(currentSong.id);
    } else {
      addToFavorites(currentSong);
    }
  };
  
  if (!currentSong) {
    return null;
  }
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
    ${expanded ? 'h-80' : 'h-20'} bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg`}>
      {/* Hidden YouTube iframe */}
      <div className="hidden">
        <iframe 
          ref={iframeRef}
          src="https://www.youtube.com/embed/?enablejsapi=1&controls=0&showinfo=0&fs=0&modestbranding=1"
          allow="autoplay"
        ></iframe>
      </div>
      
      {/* Expanded player content - visible when expanded */}
      {expanded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="flex w-full max-w-4xl">
            <div className="flex-shrink-0 w-60 h-60 rounded-lg overflow-hidden shadow-md">
              <img 
                src={currentSong.thumbnail} 
                alt={currentSong.title} 
                className="w-full h-full object-cover animate-spin-slow"
              />
            </div>
            
            <div className="flex-1 ml-6 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {currentSong.title}
              </h2>
              <p className="text-sm text-gray-500">
                {currentSong.channelTitle}
              </p>
              
              <div className="mt-6 flex-1 flex flex-col justify-end">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-xs text-gray-500 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1">
                    <Slider
                      value={[progress]}
                      min={0}
                      max={100}
                      step={0.1}
                      onValueChange={handleProgressChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10">
                    {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={toggleMute}
                      className="music-button hover:bg-gray-100"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={20} className="text-gray-600" />
                      ) : (
                        <Volume2 size={20} className="text-gray-600" />
                      )}
                    </button>
                    
                    <div className="w-24">
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={prevSong}
                      className="music-button hover:bg-gray-100"
                      aria-label="Previous song"
                    >
                      <SkipBack size={22} className="text-gray-600" />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="music-button w-12 h-12 bg-music-accent hover:bg-music-highlight text-white rounded-full"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} className="ml-1" fill="currentColor" />
                      )}
                    </button>
                    
                    <button
                      onClick={nextSong}
                      className="music-button hover:bg-gray-100"
                      aria-label="Next song"
                      disabled={queue.length === 0}
                    >
                      <SkipForward size={22} className={`${queue.length === 0 ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleToggleFavorite}
                      className="music-button hover:bg-gray-100"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        size={20} 
                        className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} 
                      />
                    </button>
                    
                    <button
                      onClick={() => setExpanded(false)}
                      className="music-button hover:bg-gray-100"
                      aria-label="Minimize player"
                    >
                      <Minimize2 size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Collapsed player controls - always visible */}
      <div className={`h-20 px-4 flex items-center ${expanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full max-w-7xl mx-auto flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-200 mr-3">
            <img 
              src={currentSong.thumbnail} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {currentSong.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {currentSong.channelTitle}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={prevSong}
              className="music-button hover:bg-gray-100"
              aria-label="Previous song"
            >
              <SkipBack size={20} className="text-gray-600" />
            </button>
            
            <button
              onClick={togglePlay}
              className="music-button w-10 h-10 bg-music-accent hover:bg-music-highlight text-white rounded-full"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="ml-0.5" fill="currentColor" />
              )}
            </button>
            
            <button
              onClick={nextSong}
              className="music-button hover:bg-gray-100"
              aria-label="Next song"
              disabled={queue.length === 0}
            >
              <SkipForward size={20} className={`${queue.length === 0 ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
          
          <div className="hidden md:flex ml-4 items-center space-x-3">
            <button
              onClick={handleToggleFavorite}
              className="music-button hover:bg-gray-100"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={18} 
                className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} 
              />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="music-button hover:bg-gray-100"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} className="text-gray-600" />
                ) : (
                  <Volume2 size={18} className="text-gray-600" />
                )}
              </button>
              
              <div className="w-20">
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            
            <button
              onClick={() => setExpanded(true)}
              className="music-button hover:bg-gray-100"
              aria-label="Expand player"
            >
              <Maximize2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar - always visible */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-music-accent transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MusicPlayer;
