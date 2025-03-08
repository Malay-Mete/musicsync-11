
import { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Plus, Clock } from 'lucide-react';
import { useMusic, Song } from '@/context/MusicContext';

interface SongCardProps {
  song: Song;
  layout?: 'grid' | 'list';
}

const SongCard = ({ song, layout = 'grid' }: SongCardProps) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    addToQueue, 
    addToFavorites, 
    removeFromFavorites,
    favorites 
  } = useMusic();
  
  const [showOptions, setShowOptions] = useState(false);
  
  const isCurrentSong = currentSong?.id === song.id;
  const isFavorite = favorites.some(fav => fav.id === song.id);
  
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentSong) {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong(song);
      }
    } else {
      playSong(song);
    }
  };
  
  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    setShowOptions(false);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromFavorites(song.id);
    } else {
      addToFavorites(song);
    }
    
    setShowOptions(false);
  };
  
  if (layout === 'list') {
    return (
      <div 
        className={`group relative flex items-center p-3 rounded-xl transition-all duration-300 
        hover:bg-gray-100 ${isCurrentSong ? 'bg-blue-50' : ''}`}
        onClick={() => playSong(song)}
      >
        <div className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-3 bg-gray-200">
          <img 
            src={song.thumbnail} 
            alt={song.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className={`absolute inset-0 flex items-center justify-center 
          bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isCurrentSong && isPlaying ? 'opacity-100' : ''}`}>
            <button
              onClick={handlePlayPause}
              className="music-button bg-white/90 text-gray-800 hover:bg-white"
            >
              {isCurrentSong && isPlaying ? (
                <Pause size={16} className="text-gray-800" />
              ) : (
                <Play size={16} className="text-gray-800" fill="currentColor" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {song.title}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {song.channelTitle}
          </p>
        </div>
        
        {song.duration && (
          <div className="flex items-center text-xs text-gray-500 mr-3">
            <Clock size={14} className="mr-1" />
            {song.duration}
          </div>
        )}
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleFavorite}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={18} 
              className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"} 
            />
          </button>
          
          <button
            onClick={handleAddToQueue}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Add to queue"
          >
            <Plus size={18} className="text-gray-500" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 animate-scale-in">
                <button
                  onClick={handleAddToQueue}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add to queue
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Heart size={16} className="mr-2" />
                  {isFavorite ? "Remove from favorites" : "Add to favorites"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={() => playSong(song)}
    >
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        <img 
          src={song.thumbnail} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayPause}
            className="music-button bg-white/90 hover:bg-white text-gray-800"
          >
            {isCurrentSong && isPlaying ? (
              <Pause size={22} className="text-gray-800" />
            ) : (
              <Play size={22} className="text-gray-800 ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
        
        {isCurrentSong && (
          <div className="absolute bottom-2 left-2 flex space-x-0.5">
            <div className="w-1 bg-white/80 rounded-full animate-music-playing-1"></div>
            <div className="w-1 bg-white/80 rounded-full animate-music-playing-2"></div>
            <div className="w-1 bg-white/80 rounded-full animate-music-playing-3"></div>
            <div className="w-1 bg-white/80 rounded-full animate-music-playing-4"></div>
          </div>
        )}
        
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={16} 
            className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"} 
          />
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {song.title}
        </h3>
        <p className="text-xs text-gray-500 truncate mt-1">
          {song.channelTitle}
        </p>
      </div>
    </div>
  );
};

export default SongCard;
