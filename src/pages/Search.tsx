
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MusicPlayer from '@/components/music/MusicPlayer';
import SongList from '@/components/music/SongList';
import { useMusic } from '@/context/MusicContext';
import { Button } from '@/components/ui/button';

const Search = () => {
  const { searchQuery, searchResults } = useMusic();
  
  return (
    <div className="min-h-screen bg-music-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-24 pb-24 px-4 md:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <section className="mb-8">
            {searchQuery ? (
              <div className="mb-8">
                <span className="text-sm text-gray-500">Search results for</span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                  "{searchQuery}"
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {searchResults.length} results found
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Search Results
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Explore music from our library
                </p>
              </div>
            )}
            
            <SongList />
          </section>
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default Search;
