import { Car } from 'lucide-react';
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
      <div className="flex items-center gap-3 min-w-0"> {/* Increased gap for better spacing */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 cursor-pointer shadow-lg bg-white p-1"
          onClick={handleLogoClick}
        >
          {/* CARSTOK Logo */}
          <img
            src="/images/logo.png"
            alt="CARSTOK Logo"
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="min-w-0"> {/* Allows this flex item to shrink */}
          <h1 className="font-display text-xl font-bold text-white truncate"> {/* Increased size */}
            {getTitle()}
          </h1>
          <p className="text-xs text-muted-foreground truncate">by Elyndra Tech</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0"> {/* Prevents buttons from shrinking */}
        <button
          onClick={() => {
            // This button now serves as the car icon only
            // The 7-click admin access is handled by the logo (C) click
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0 bg-primary/10 hover:bg-primary/20 transition-colors shadow-lg" // Increased size
        >
          <Car className="h-7 w-7 text-primary" /> {/* Increased size */}
        </button>
      </div>
    </header>
  );
};

export default Header;
