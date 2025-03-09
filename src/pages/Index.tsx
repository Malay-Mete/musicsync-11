import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MusicPlayer from '@/components/music/MusicPlayer';
import SongList from '@/components/music/SongList';
import { Play, Search, Heart } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useYoutubeSearch } from '@/hooks/useYoutubeSearch';
import { useAutoRecommendations } from '@/utils/openAiRecommendations';

const Index = () => {
  const navigate = useNavigate();
  const { searchResults, setSearchResults, favorites, currentSong, recentlyPlayed } = useMusic();
  const { search } = useYoutubeSearch();
  const { refreshRecommendations } = useAutoRecommendations();
  const [recommendationTitle, setRecommendationTitle] = useState("Discover Music");
  
  useEffect(() => {
    const loadInitialContent = async () => {
      const results = await search('popular music');
      if (results) {
        setSearchResults(results);
      }
    };
    
    if (searchResults.length === 0) {
      loadInitialContent();
    }
  }, []);
  
  useEffect(() => {
    const updateRecommendations = async () => {
      const results = await refreshRecommendations(currentSong, recentlyPlayed, favorites);
      if (results && results.length > 0) {
        setSearchResults(results);
        
        if (currentSong) {
          setRecommendationTitle(`Because you listened to ${currentSong.title}`);
        } else if (recentlyPlayed.length > 0) {
          setRecommendationTitle('Based on your recently played');
        } else {
          setRecommendationTitle('Recommended for you');
        }
      }
    };
    
    updateRecommendations();
    
    const intervalId = setInterval(updateRecommendations, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [currentSong, recentlyPlayed, favorites]);
  
  return (
    <div className="min-h-screen bg-music-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-24 pb-24 px-4 md:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <section className="mb-12">
            <div className="w-full h-72 rounded-2xl overflow-hidden relative bg-gray-100 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-90"></div>
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                <span className="text-sm font-medium text-white/80 bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full inline-block mb-3 w-max">
                  Music Stream Sync
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl mb-3">
                  Discover and play music you love
                </h1>
                <p className="text-white/80 max-w-lg mb-6">
                  Search for your favorite songs and play them instantly with our data-saving player
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => navigate('/search')}
                    className="bg-white text-gray-800 hover:bg-white/90 gap-2"
                  >
                    <Search size={18} />
                    Find Music
                  </Button>
                  <Button 
                    onClick={() => navigate('/favorites')}
                    variant="outline"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm gap-2"
                  >
                    <Heart size={18} />
                    My Favorites
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <SongList 
              title={recommendationTitle} 
              description="Personalized music suggestions powered by AI"
            />
          </section>

          {favorites.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Favorites</h2>
                  <p className="text-sm text-gray-500 mt-1">Quick access to your favorite songs</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/favorites')}
                  className="text-sm"
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favorites.slice(0, 4).map((song) => (
                  <div 
                    key={song.id}
                    className="relative rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => navigate('/favorites')}
                  >
                    <div className="relative aspect-video bg-gray-200">
                      <img 
                        src={song.thumbnail} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play size={24} className="text-gray-800 ml-1" fill="currentColor" />
                        </div>
                      </div>
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
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default Index;
