
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Home, Music } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import SearchBar from '@/components/music/SearchBar';

const Navbar = () => {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useMusic();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 
      ${isScrolled ? 'bg-white/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-full bg-music-accent flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
            <Music size={20} />
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-music-text to-music-accent">
            MusicSync
          </span>
        </Link>
        
        <div className="flex-1 max-w-2xl mx-12">
          <SearchBar />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`nav-link flex items-center space-x-1 ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link 
            to="/search" 
            className={`nav-link flex items-center space-x-1 ${location.pathname === '/search' ? 'active' : ''}`}
          >
            <Search size={18} />
            <span>Explore</span>
          </Link>
          <Link 
            to="/favorites" 
            className={`nav-link flex items-center space-x-1 ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            <Heart size={18} />
            <span>Favorites</span>
          </Link>
        </nav>
        
        <div className="md:hidden flex items-center">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
