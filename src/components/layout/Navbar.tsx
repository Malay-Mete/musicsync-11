
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Home, Music, Menu, X } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import SearchBar from '@/components/music/SearchBar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Navbar = () => {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useMusic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 py-4 
      ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group z-20">
          <div className="w-10 h-10 rounded-full bg-music-accent flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
            <Music size={20} />
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-music-text dark:from-white to-music-accent">
            MusicSync
          </span>
        </Link>
        
        <div className="hidden md:block flex-1 max-w-2xl mx-12">
          <SearchBar />
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-6">
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
          <ThemeToggle />
        </div>
        
        <div className="md:hidden flex items-center space-x-2 z-20">
          <ThemeToggle />
          <button 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden mt-4 px-4">
        <SearchBar />
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-10 transition-transform duration-300 transform md:hidden pt-24 pb-20 px-6
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 text-lg font-medium p-2 rounded-lg
              ${location.pathname === '/' ? 'text-music-accent bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200'}`}
          >
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link 
            to="/search" 
            className={`flex items-center space-x-3 text-lg font-medium p-2 rounded-lg
              ${location.pathname === '/search' ? 'text-music-accent bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200'}`}
          >
            <Search size={24} />
            <span>Explore</span>
          </Link>
          <Link 
            to="/favorites" 
            className={`flex items-center space-x-3 text-lg font-medium p-2 rounded-lg
              ${location.pathname === '/favorites' ? 'text-music-accent bg-gray-100 dark:bg-gray-800' : 'text-gray-800 dark:text-gray-200'}`}
          >
            <Heart size={24} />
            <span>Favorites</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
