
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
  Minimize2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    removeFromFavorites,
    currentTime: contextCurrentTime,
    setCurrentTime: setContextCurrentTime
  } = useMusic();
  
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(contextCurrentTime);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [playerReady, setPlayerReady] = useState(false);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const progressInterval = useRef<number | null>(null);
  
  const isFavorite = currentSong ? favorites.some(fav => fav.id === currentSong.id) : false;
  
  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Define the callback function that YouTube API will call when ready
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else if (!playerReady) {
      initializePlayer();
    }
    
    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  // Sync currentTime with context
  useEffect(() => {
    if (contextCurrentTime > 0 && Math.abs(contextCurrentTime - currentTime) > 1) {
      setCurrentTime(contextCurrentTime);
      setSeekTo(contextCurrentTime);
    }
  }, [contextCurrentTime]);
  
  // Handle seeking to the saved position when player is ready
  useEffect(() => {
    if (playerReady && playerRef.current && seekTo !== null) {
      playerRef.current.seekTo(seekTo, true);
      setSeekTo(null);
    }
  }, [playerReady, seekTo]);
  
  // Load song when current song changes
  useEffect(() => {
    if (currentSong && playerRef.current && playerReady) {
      playerRef.current.loadVideoById({
        videoId: currentSong.id,
        startSeconds: contextCurrentTime > 0 ? contextCurrentTime : 0
      });
      
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [currentSong, playerReady]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.playVideo();
        
        // Start progress tracking
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
        
        progressInterval.current = window.setInterval(() => {
          if (playerRef.current) {
            const currentTimeValue = playerRef.current.getCurrentTime() || 0;
            const durationValue = playerRef.current.getDuration() || 0;
            setCurrentTime(currentTimeValue);
            setContextCurrentTime(currentTimeValue);
            setDuration(durationValue);
            setProgress((currentTimeValue / durationValue) * 100 || 0);
          }
        }, 1000);
      } else {
        playerRef.current.pauseVideo();
        
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
      }
    }
  }, [isPlaying, playerReady]);
  
  // Handle volume changes
  useEffect(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(volume);
    }
  }, [volume, playerReady]);
  
  const initializePlayer = () => {
    if (!iframeRef.current || !window.YT) return;
    
    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            event.target.setVolume(volume);
            
            // If there's a current song, load it
            if (currentSong) {
              event.target.loadVideoById({
                videoId: currentSong.id,
                startSeconds: contextCurrentTime > 0 ? contextCurrentTime : 0
              });
              
              if (isPlaying) {
                event.target.playVideo();
              } else {
                event.target.pauseVideo();
              }
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              nextSong();
            }
          },
          onError: (event) => {
            console.error("YouTube player error:", event);
          }
        },
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  };
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleProgressChange = (value: number[]) => {
    if (playerRef.current && duration && playerReady) {
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
    ${expanded ? 'h-80' : 'h-20'} bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg`}>
      {/* Hidden YouTube iframe */}
      <div className="hidden">
        <iframe 
          ref={iframeRef}
          src={`https://www.youtube.com/embed/?enablejsapi=1&controls=0&showinfo=0&fs=0&modestbranding=1&origin=${window.location.origin}`}
          allow="autoplay; encrypted-media"
          title="YouTube music player"
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
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 ml-6 flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {currentSong.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentSong.channelTitle}
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="mt-6 flex-1 flex flex-col justify-end">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
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
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                    {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={20} className="text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Volume2 size={20} className="text-gray-600 dark:text-gray-300" />
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
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Previous song"
                    >
                      <SkipBack size={22} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="p-3 w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} className="ml-1" />
                      )}
                    </button>
                    
                    <button
                      onClick={nextSong}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Next song"
                      disabled={queue.length === 0}
                    >
                      <SkipForward size={22} className={`${queue.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleToggleFavorite}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        size={20} 
                        className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-300"} 
                      />
                    </button>
                    
                    <button
                      onClick={() => setExpanded(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Minimize player"
                    >
                      <Minimize2 size={20} className="text-gray-600 dark:text-gray-300" />
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
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3">
              <img 
                src={currentSong.thumbnail} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {currentSong.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentSong.channelTitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={prevSong}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous song"
            >
              <SkipBack size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-2 w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="ml-0.5" />
              )}
            </button>
            
            <button
              onClick={nextSong}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Next song"
              disabled={queue.length === 0}
            >
              <SkipForward size={20} className={`${queue.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`} />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={handleToggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  size={18} 
                  className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-300"} 
                />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={18} className="text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Volume2 size={18} className="text-gray-600 dark:text-gray-300" />
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
            </div>
            
            <button
              onClick={() => setExpanded(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Expand player"
            >
              <Maximize2 size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Progress bar - always visible */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-blue-500 transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MusicPlayer;
