
import { useState, useEffect, useRef } from 'react';
import { Search, X, Music, Clock, User, Disc, FileMusic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '@/context/MusicContext';
import { useYoutubeSearch } from '@/hooks/useYoutubeSearch';
import { getFromStorage, STORAGE_KEYS } from '@/utils/localStorage';
import { useIsMobile } from '@/hooks/use-mobile';

const SearchBar = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setSearchResults, setIsSearching } = useMusic();
  const { search, searchHistory, clearHistory, isLoading } = useYoutubeSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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

  const getIconForHistoryItem = (item: any) => {
    const types: Record<string, any> = {
      'artist': <User size={24} className="text-gray-400" />,
      'album': <Disc size={24} className="text-gray-400" />,
      'song': <FileMusic size={24} className="text-gray-400" />
    };
    
    return types[item.type] || <Clock size={24} className="text-gray-400" />;
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative rounded-full overflow-hidden shadow-sm border ${
          isMobile ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 hover:border-gray-300 bg-white/80'
        } backdrop-blur-sm transition-colors duration-200`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className={isMobile ? "text-gray-400" : "text-gray-400"} />
          </div>
          
          <input
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={`block w-full py-2 pl-10 pr-10 border-0 bg-transparent focus:ring-0 text-sm ${
              isMobile ? 'text-white placeholder-gray-400' : 'text-gray-900'
            } outline-none`}
          />
          
          {isMobile && !inputValue && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="text-sm font-medium text-white">Cancel</span>
            </button>
          )}
          
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className={isMobile ? "text-gray-400" : "text-gray-400 hover:text-gray-600"} />
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
        <div className={`absolute mt-2 w-full ${
          isMobile ? 'bg-black text-white' : 'bg-white'
        } rounded-lg shadow-lg overflow-hidden border ${
          isMobile ? 'border-gray-800' : 'border-gray-100'
        } animate-scale-in z-10 ${
          isMobile ? 'left-0 right-0' : ''
        }`}>
          {searchHistory.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.query)}
                  className={`w-full text-left px-4 py-3 ${
                    isMobile ? 'hover:bg-gray-900 border-b border-gray-800' : 'hover:bg-gray-50'
                  } flex items-center`}
                >
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center mr-3">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.query} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getIconForHistoryItem(item)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                      {item.query}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.type || 'Search'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <Music size={24} className={`mx-auto ${isMobile ? 'text-gray-700' : 'text-gray-300'} mb-2`} />
              <p className={`text-sm ${isMobile ? 'text-gray-500' : 'text-gray-500'}`}>
                Start searching for music
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
