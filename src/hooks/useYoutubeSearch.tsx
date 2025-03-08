
import { useState, useCallback } from 'react';
import { Song } from '@/context/MusicContext';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/localStorage';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

// Mock function for YouTube search since we don't have a real API key
const mockYouTubeSearch = async (query: string): Promise<Song[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock results based on query
  return Array(10).fill(null).map((_, index) => ({
    id: `mock-${query}-${index}`,
    title: `${query} - Song ${index + 1}`,
    thumbnail: `https://picsum.photos/seed/${query}${index}/300/200`,
    channelTitle: `Channel ${index + 1}`,
    publishedAt: new Date().toISOString(),
    duration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  }));
};

export const useYoutubeSearch = () => {
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(
    getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, [])
  );

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, we would call the YouTube API here
      const data = await mockYouTubeSearch(query);
      setResults(data);
      
      // Update search history
      const newHistory = [
        { query, timestamp: Date.now() },
        ...searchHistory.filter(item => item.query !== query).slice(0, 9)
      ];
      setSearchHistory(newHistory);
      saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    searchHistory,
    clearHistory
  };
};
