
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MusicPlayer from '@/components/music/MusicPlayer';
import SongCard from '@/components/music/SongCard';
import { useMusic } from '@/context/MusicContext';
import { Music, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const { favorites } = useMusic();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="min-h-screen bg-music-background">
      <Navbar />
      <Sidebar />
      
      <main className="pt-24 pb-24 px-4 md:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <section>
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <Heart size={24} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {favorites.length} {favorites.length === 1 ? 'song' : 'songs'} saved
                </p>
              </div>
            </div>
            
            {favorites.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <Music size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No favorites yet</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Start adding songs you love to your favorites</p>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">All Favorites</h2>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">View:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setLayout('grid')}
                        className={`p-1.5 rounded-md ${layout === 'grid' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-500 hover:text-gray-700'}`}
                        aria-label="Grid view"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </button>
                      <button
                        onClick={() => setLayout('list')}
                        className={`p-1.5 rounded-md ${layout === 'list' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-500 hover:text-gray-700'}`}
                        aria-label="List view"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className={layout === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                  : "space-y-2"
                }>
                  {favorites.map((song) => (
                    <SongCard key={song.id} song={song} layout={layout} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      
      <MusicPlayer />
    </div>
  );
};

export default Favorites;
