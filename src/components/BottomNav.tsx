import { Home, Search, ShoppingCart, Car } from 'lucide-react';
import { useState } from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const [transitioningTab, setTransitioningTab] = useState<string | null>(null);

  const tabs = [
    { id: 'vente', icon: ShoppingCart, label: 'Vente' },
    { id: 'location', icon: Car, label: 'Location' },
    { id: 'explore', icon: Search, label: 'Recherche' },
  ];

  const handleTabChange = (tabId: string) => {
    // Add special animation when switching between vente and location
    if ((activeTab === 'vente' && tabId === 'location') || (activeTab === 'location' && tabId === 'vente')) {
      setTransitioningTab(tabId);
      setTimeout(() => setTransitioningTab(null), 1000); // Reset after animation
    }
    onTabChange(tabId);
  };

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-border/30">
      <div className="flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 sm:px-6 py-2 transition-all min-w-[60px] sm:min-w-[80px] rounded-lg ${
                isActive ? 'bg-primary/20' : 'hover:bg-primary/10'
              } btn-hover btn-active ${
                isActive ? 'animate-pulse-slow' : ''
              } ${
                transitioningTab === tab.id ? 'animate-bounce-slow' : ''
              }`}
            >
              <Icon
                className={`h-6 w-6 sm:h-7 sm:w-7 transition-colors flex-shrink-0 ${
                  isActive ? 'text-primary' : 'text-white'
                } ${
                  isActive ? 'animate-bounce-slow' : ''
                } ${
                  transitioningTab === tab.id ? 'animate-bounce-slow' : ''
                }`}
              />
              <span
                className={`text-xs sm:text-sm transition-colors ${
                  isActive ? 'text-primary font-medium' : 'text-white'
                } ${
                  isActive ? 'animate-pulse-slow' : ''
                } ${
                  transitioningTab === tab.id ? 'animate-pulse-slow' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
