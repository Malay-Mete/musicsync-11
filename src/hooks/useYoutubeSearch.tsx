
import { useState, useCallback } from 'react';
import { Song } from '@/context/MusicContext';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/localStorage';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

// YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyDQ9Qpe0625tXcKj3WakqJQLdpIQruN3aI';

// Real YouTube search function that uses the YouTube Data API
const youTubeSearch = async (query: string): Promise<Song[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(
        query
      )}&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the YouTube API response into our Song format
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: '0:00' // We'll need a separate API call to get durations
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
};

export const useYoutubeSearch = () => {
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(
    getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, [])
  );

  const search = useCallback(async (query: string): Promise<Song[] | undefined> => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the real YouTube API instead of the mock function
      const data = await youTubeSearch(query);
      setResults(data);
      
      // Update search history
      const newHistory = [
        { query, timestamp: Date.now() },
        ...searchHistory.filter(item => item.query !== query).slice(0, 9)
      ];
      setSearchHistory(newHistory);
      saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
      
      return data;
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setResults([]);
      return [];
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
