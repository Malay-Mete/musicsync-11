
import { useState, useEffect, useRef } from 'react';
import { Search, X, Music, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '@/context/MusicContext';
import { useYoutubeSearch } from '@/hooks/useYoutubeSearch';
import { getFromStorage, STORAGE_KEYS } from '@/utils/localStorage';

const SearchBar = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setSearchResults, setIsSearching } = useMusic();
  const { search, searchHistory, clearHistory, isLoading } = useYoutubeSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside of the search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      setIsSearching(true);
      
      const results = await search(inputValue);
      if (results) {
        setSearchResults(results);
      }
      setShowDropdown(false);
      
      navigate('/search');
    }
  };
  
  const handleItemClick = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    setShowDropdown(false);
    handleSubmit();
  };
  
  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-full overflow-hidden shadow-sm border border-gray-200 hover:border-gray-300 transition-colors duration-200 bg-white/80 backdrop-blur-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          
          <input
            type="text"
            placeholder="Search for songs, artists..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="block w-full py-2 pl-10 pr-10 border-0 bg-transparent focus:ring-0 text-sm text-gray-900 outline-none"
          />
          
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
          </div>
        )}
      </form>
      
      {showDropdown && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 animate-scale-in z-10">
          {searchHistory.length > 0 ? (
            <>
              <div className="p-2 flex items-center justify-between border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">Recent searches</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item.query)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{item.query}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="py-8 px-4 text-center">
              <Music size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Start searching for music</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
