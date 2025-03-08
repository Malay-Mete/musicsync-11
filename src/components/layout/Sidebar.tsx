
import { Link } from 'react-router-dom';
import { Home, Search, Heart, PlusCircle, List, Music } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';

const Sidebar = () => {
  const { favorites, queue } = useMusic();
  
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 pt-24 pb-4 px-4 glass-panel bg-white/40 border-r border-gray-100">
      <div className="flex-1 flex flex-col">
        <nav className="space-y-1 mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Menu
          </h3>
          
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Home size={18} className="mr-3 text-gray-400" />
            Home
          </Link>
          
          <Link
            to="/search"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Search size={18} className="mr-3 text-gray-400" />
            Search
          </Link>
          
          <Link
            to="/favorites"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Heart size={18} className="mr-3 text-gray-400" />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-gray-100">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
        
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 flex justify-between items-center">
            <span>Playlists</span>
            <button 
              aria-label="Add Playlist"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <PlusCircle size={16} />
            </button>
          </h3>
          
          <div className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 transition-colors">
              <List size={18} className="mr-3 text-gray-400" />
              Create Playlist
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex-1 overflow-y-auto scrollbar-none">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Queue {queue.length > 0 && `(${queue.length})`}
          </h3>
          
          {queue.length > 0 ? (
            <div className="space-y-1">
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden mr-3">
                    <img 
                      src={song.thumbnail} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {song.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {song.channelTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center px-3">
              <Music size={32} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Your queue is empty</p>
              <p className="text-xs text-gray-400">Add songs to play them next</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
