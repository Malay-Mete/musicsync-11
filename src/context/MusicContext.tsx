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

  // Load favorites from localStorage on initialization
  useEffect(() => {
    const savedFavorites = localStorage.getItem('music-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
      }
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('music-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
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
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(queue.slice(1));
      setIsPlaying(true);
    }
  };

  const prevSong = () => {
    // We don't have previous song history yet, so this is a placeholder
    // In a real app, we would keep track of played songs
    setIsPlaying(true);
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
