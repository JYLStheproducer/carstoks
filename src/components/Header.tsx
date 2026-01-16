import { Car, Settings, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab?: string;
}

const Header = ({ activeTab = 'vente' }: HeaderProps) => {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 7) {
      // Redirect to admin page
      window.location.href = '/admin';
      setClickCount(0); // Reset the count
    }

    // Reset the count after 3 seconds if not at 7 clicks
    setTimeout(() => {
      if (clickCount !== 7) {
        setClickCount(0);
      }
    }, 3000);
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'location':
        return 'CARSTOK Location';
      case 'vente':
        return 'CARSTOK Vente';
      default:
        return 'CARSTOK';
    }
  };

  return (
    <header className={`safe-top fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pt-4 ${activeTab === 'location' ? 'location-theme' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo CT only - Premium look */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 cursor-pointer shadow-lg bg-white/10 backdrop-blur-md"
          onClick={handleLogoClick}
        >
          <span className="text-xl font-bold text-white">CT</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg">
          <Settings className="h-5 w-5 text-white" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg">
          <User className="h-5 w-5 text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
