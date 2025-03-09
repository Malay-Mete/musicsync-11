
import React from 'react';
import { useMusic } from '@/context/MusicContext';
import { Home, Search, Library, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileScreen = () => {
  const { currentSong, isPlaying, playSong, pauseSong, nextSong, prevSong } = useMusic();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else if (currentSong) {
      playSong(currentSong);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white h-24 md:hidden">
      {/* Current song info (if playing) */}
      {currentSong && (
        <div className="w-full h-12 bg-black/90 flex items-center px-3">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 rounded overflow-hidden mr-2">
              <img 
                src={currentSong.thumbnail} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 mr-2">
              <p className="text-xs text-white font-medium truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.channelTitle}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={prevSong}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white"
                aria-label="Previous song"
              >
                <SkipBack size={16} />
              </button>
              <button 
                onClick={handlePlayPause}
                className="w-8 h-8 flex items-center justify-center text-white"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <button 
                onClick={nextSong}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white"
                aria-label="Next song"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation tabs */}
      <div className="flex justify-around items-center h-12 bg-black/95">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            location.pathname === '/' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-0.5">Home</span>
        </Link>
        <Link 
          to="/search" 
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            location.pathname === '/search' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <Search size={20} />
          <span className="text-xs mt-0.5">Search</span>
        </Link>
        <Link 
          to="/favorites" 
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            location.pathname === '/favorites' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <Library size={20} />
          <span className="text-xs mt-0.5">Library</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileScreen;
