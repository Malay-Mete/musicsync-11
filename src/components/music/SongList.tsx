
import { useMusic } from '@/context/MusicContext';
import SongCard from './SongCard';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Grid, List, Music } from 'lucide-react';

interface SongListProps {
  title?: string;
  description?: string;
}

const SongList = ({ title, description }: SongListProps) => {
  const { searchResults, isSearching, searchQuery } = useMusic();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <span className="text-sm text-gray-500">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-md ${layout === 'grid' 
                ? 'bg-white shadow-sm text-gray-800' 
                : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-md ${layout === 'list' 
                ? 'bg-white shadow-sm text-gray-800' 
                : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {isSearching && searchResults.length === 0 && (
        <div className="w-full py-16 flex flex-col items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Searching for "{searchQuery}"</h3>
          <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
        </div>
      )}
      
      {!isSearching && searchResults.length === 0 && (
        <div className="w-full py-16 flex flex-col items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Music size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No results found</h3>
          <p className="text-sm text-gray-500 mt-1">Try searching for something else</p>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className={layout === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
          : "space-y-2"
        }>
          {searchResults.map((song) => (
            <SongCard key={song.id} song={song} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SongList;
