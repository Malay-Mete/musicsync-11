
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MusicPlayer from '@/components/music/MusicPlayer';
import SongList from '@/components/music/SongList';
import SearchBar from '@/components/music/SearchBar';
import { useMusic } from '@/context/MusicContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Search = () => {
  const { searchQuery, searchResults } = useMusic();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
      {!isMobile && <Navbar />}
      {!isMobile && <Sidebar />}
      
      <main className={isMobile ? "pt-4 pb-24 px-4" : "pt-24 pb-24 px-4 md:px-8 lg:pl-72"}>
        <div className="max-w-7xl mx-auto">
          {isMobile ? (
            <div className="sticky top-0 z-10 mb-4 bg-black dark:bg-gray-900 pt-2 pb-4 px-2">
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={() => navigate('/')}
                  className="text-white rounded-full p-1"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                  <SearchBar />
                </div>
              </div>
              <h2 className="text-white text-lg font-medium pl-2">Recent searches</h2>
            </div>
          ) : (
            <section className="mb-8">
              <div className="mb-8">
                <SearchBar />
              </div>
              
              {searchQuery ? (
                <div className="mb-8">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Search results for</span>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    "{searchQuery}"
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {searchResults.length} results found
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Search Results
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Explore music from our library
                  </p>
                </div>
              )}
            </section>
          )}
          
          <SongList />
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default Search;
