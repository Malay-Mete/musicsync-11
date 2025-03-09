
import { Song } from '@/context/MusicContext';
import { useYoutubeSearch } from '@/hooks/useYoutubeSearch';

// OpenAI recommendation API
export const getRecommendations = async (
  currentSong: Song | null, 
  recentlyPlayed: Song[] = [], 
  favorites: Song[] = []
): Promise<string> => {
  try {
    // Create a context from current song, recently played, and favorites
    const songContext = [
      currentSong ? `Current song: ${currentSong.title} by ${currentSong.channelTitle}` : '',
      recentlyPlayed.length > 0 ? 
        `Recently played: ${recentlyPlayed.slice(0, 3).map(s => `${s.title} by ${s.channelTitle}`).join(', ')}` : '',
      favorites.length > 0 ? 
        `Favorite songs: ${favorites.slice(0, 3).map(s => `${s.title} by ${s.channelTitle}`).join(', ')}` : ''
    ].filter(Boolean).join('. ');

    // If we don't have enough context, provide a generic recommendation query
    if (!songContext) {
      return 'popular trending music';
    }

    // For demonstration, we'll create a simulated recommendation
    // In a real implementation, this would call OpenAI's API
    const genres = ['pop', 'rock', 'hip hop', 'jazz', 'electronic', 'classical', 'indie'];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    // Simulate recommendations based on context
    let recommendation = '';

    if (currentSong) {
      const descriptors = ['similar to', 'like', 'in the style of', 'with the same energy as'];
      const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
      recommendation = `${randomGenre} music ${randomDescriptor} ${currentSong.title}`;
    } else if (recentlyPlayed.length > 0) {
      recommendation = `popular ${randomGenre} music similar to ${recentlyPlayed[0].channelTitle}`;
    } else if (favorites.length > 0) {
      recommendation = `best ${randomGenre} music 2023`;
    } else {
      recommendation = `trending ${randomGenre} music`;
    }

    return recommendation;
  } catch (error) {
    console.error('Error getting OpenAI recommendations:', error);
    return 'popular music trending';
  }
};

// Hook to periodically refresh recommendations
export const useAutoRecommendations = () => {
  const { search } = useYoutubeSearch();

  const refreshRecommendations = async (
    currentSong: Song | null, 
    recentlyPlayed: Song[] = [], 
    favorites: Song[] = []
  ) => {
    try {
      const query = await getRecommendations(currentSong, recentlyPlayed, favorites);
      const results = await search(query);
      return results;
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      return [];
    }
  };

  return { refreshRecommendations };
};
