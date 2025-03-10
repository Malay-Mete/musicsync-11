import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Song {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  favorites: Song[];
  searchResults: Song[];
  searchQuery: string;
  isSearching: boolean;
  currentTime: number;
  recentlyPlayed: Song[];
  setCurrentSong: (song: Song | null) => void;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  addToFavorites: (song: Song) => void;
  removeFromFavorites: (songId: string) => void;
  setSearchResults: (results: Song[]) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  nextSong: () => void;
  prevSong: () => void;
  setCurrentTime: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [queue, setQueue] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('music-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
      }
    }
    
    const savedVolume = localStorage.getItem('music-volume');
    if (savedVolume) {
      try {
        setVolume(JSON.parse(savedVolume));
      } catch (error) {
        console.error('Failed to parse volume from localStorage', error);
      }
    }
    
    const savedQueue = localStorage.getItem('music-queue');
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (error) {
        console.error('Failed to parse queue from localStorage', error);
      }
    }
    
    const savedRecentlyPlayed = localStorage.getItem('music-recently-played');
    if (savedRecentlyPlayed) {
      try {
        setRecentlyPlayed(JSON.parse(savedRecentlyPlayed));
      } catch (error) {
        console.error('Failed to parse recently played from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('music-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem('music-volume', JSON.stringify(volume));
  }, [volume]);
  
  useEffect(() => {
    localStorage.setItem('music-queue', JSON.stringify(queue));
  }, [queue]);
  
  useEffect(() => {
    localStorage.setItem('music-recently-played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  const playSong = (song: Song) => {
    if (currentSong) {
      const updatedRecentlyPlayed = [
        currentSong,
        ...recentlyPlayed.filter(s => s.id !== currentSong.id).slice(0, 19)
      ];
      setRecentlyPlayed(updatedRecentlyPlayed);
    }
    
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
  };

  const removeFromQueue = (songId: string) => {
    setQueue(queue.filter(song => song.id !== songId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const addToFavorites = (song: Song) => {
    if (!favorites.some(fav => fav.id === song.id)) {
      setFavorites([...favorites, song]);
    }
  };

  const removeFromFavorites = (songId: string) => {
    setFavorites(favorites.filter(song => song.id !== songId));
  };

  const nextSong = () => {
    if (queue.length > 0) {
      if (currentSong) {
        const updatedRecentlyPlayed = [
          currentSong,
          ...recentlyPlayed.filter(s => s.id !== currentSong.id).slice(0, 19)
        ];
        setRecentlyPlayed(updatedRecentlyPlayed);
      }
      
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(queue.slice(1));
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const prevSong = () => {
    if (recentlyPlayed.length > 0) {
      const prevSong = recentlyPlayed[0];
      
      if (currentSong) {
        setQueue([currentSong, ...queue]);
      }
      
      setCurrentSong(prevSong);
      setRecentlyPlayed(recentlyPlayed.slice(1));
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        queue,
        favorites,
        searchResults,
        searchQuery,
        isSearching,
        currentTime,
        recentlyPlayed,
        setCurrentSong,
        playSong,
        pauseSong,
        togglePlay,
        setVolume,
        addToQueue,
        removeFromQueue,
        clearQueue,
        addToFavorites,
        removeFromFavorites,
        setSearchResults,
        setSearchQuery,
        setIsSearching,
        nextSong,
        prevSong,
        setCurrentTime,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
