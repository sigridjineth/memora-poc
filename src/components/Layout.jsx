import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, UploadCloud, Package, Brain, Search, Wallet, Menu, X } from 'lucide-react';

// --- Constants (Readability: Naming Magic Numbers & Cohesion: Relating Magic Numbers to Logic) ---
const ICON_SIZES = {
  LOGO_BRAIN: 32,
  NAV_ITEM_DESKTOP_ICON: 20, // Example if icons were used in desktop nav
  SEARCH_ICON: 20,
  WALLET_ICON: 18,
  MENU_TOGGLE_ICON: 24,
};

const NAV_ITEMS_CONFIG = [
  { name: 'Explore', path: '/marketplace', icon: Compass },
  { name: 'Import Memory', path: '/import-memory', icon: UploadCloud },
  { name: 'My Collection', path: '/my-collection', icon: Package },
];

const FOOTER_LINKS_CONFIG = [
  { name: 'About Us', path: '/about' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Privacy Policy', path: '/privacy' },
];

const SEARCH_PLACEHOLDER = "Search Memories, Collections...";
const APP_NAME = "Memora";

// --- Helper Components (Readability: Abstracting Implementation Details) ---

const AppLogo = React.memo(() => (
  <Link to="/marketplace" className="flex items-center space-x-2 text-white">
    <Brain size={ICON_SIZES.LOGO_BRAIN} className="text-accent-purple" />
    <h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
  </Link>
));

const DesktopNavItem = React.memo(({ path, name, isActive }) => (
  <Link
    to={path}
    className={`text-sm font-medium transition-colors
      ${isActive ? 'text-accent-purple' : 'text-gray-light hover:text-white'}`}
  >
    {name}
  </Link>
));

const SearchBarComponent = React.memo(({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = useCallback((e) => {
    // Predictability: Revealing Hidden Logic (explicit navigation)
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }, [searchTerm, navigate]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={SEARCH_PLACEHOLDER}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleSearch}
        className="w-full pl-10 pr-4 py-2 bg-navy-light border border-gray-dark rounded-lg text-gray-light focus:ring-2 focus:ring-accent-purple focus:border-accent-purple placeholder-gray-medium text-sm"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" size={ICON_SIZES.SEARCH_ICON} />
    </div>
  );
});

const ConnectWalletButton = React.memo(({ onClick, isMobile = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 bg-accent-purple text-white text-sm font-medium rounded-lg hover:bg-opacity-80 transition-colors
      ${isMobile ? 'w-full mt-2 justify-center' : 'hidden sm:flex'}`}
  >
    <Wallet size={ICON_SIZES.WALLET_ICON} className="mr-2" />
    Connect Wallet
  </button>
));

const MobileMenu = React.memo(({ isOpen, onClose, navItems, onConnectWallet }) => {
  if (!isOpen) return null;
  const location = useLocation();

  return (
    <div className="md:hidden border-t border-gray-dark bg-navy-medium">
      <nav className="px-4 pt-2 pb-4 space-y-1">
        <SearchBarComponent className="w-full my-2" />
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose} // Close menu on navigation
            className={`block px-3 py-2 rounded-md text-base font-medium
              ${location.pathname.startsWith(item.path) ? 'bg-accent-purple text-white' : 'text-gray-light hover:bg-gray-dark hover:text-white'}`}
          >
            {item.name}
          </Link>
        ))}
        <ConnectWalletButton onClick={() => { onConnectWallet(); onClose(); }} isMobile={true} />
      </nav>
    </div>
  );
});

// --- Main Layout Component ---
const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Predictability: Revealing Hidden Logic (explicit action)
  const handleConnectWallet = useCallback(() => {
    console.log("Connect Wallet action triggered"); // For development
    alert("Connect Wallet clicked (placeholder - integration needed)");
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-navy-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-navy-medium/80 backdrop-blur-md border-b border-gray-dark shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16"> {/* h-16 is a common header height, could be a const if used in JS */}
            {/* Left Section: Logo & Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <AppLogo />
              <nav className="hidden md:flex items-center space-x-6">
                {NAV_ITEMS_CONFIG.map((item) => (
                  <DesktopNavItem
                    key={item.name}
                    path={item.path}
                    name={item.name}
                    isActive={location.pathname.startsWith(item.path)}
                  />
                ))}
              </nav>
            </div>

            {/* Center Section: Search Bar (Larger Screens) */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <SearchBarComponent className="w-full max-w-md" />
            </div>
            
            {/* Right Section: Wallet Button & Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <ConnectWalletButton onClick={handleConnectWallet} />
              <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="text-gray-light hover:text-white p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? <X size={ICON_SIZES.MENU_TOGGLE_ICON} /> : <Menu size={ICON_SIZES.MENU_TOGGLE_ICON} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Menu Panel */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          navItems={NAV_ITEMS_CONFIG}
          onConnectWallet={handleConnectWallet}
        />
      </header>

      {/* Main Content Area (Coupling: Composition via children prop) */}
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-dark text-center text-gray-medium text-sm">
        <p>&copy; {new Date().getFullYear()} {APP_NAME} Protocol. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          {FOOTER_LINKS_CONFIG.map(link => (
            <Link key={link.name} to={link.path} className="hover:text-white">{link.name}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
