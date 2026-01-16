import { Home, Search, ShoppingCart, Car, Heart, User } from 'lucide-react';
import { useState } from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const [transitioningTab, setTransitioningTab] = useState<string | null>(null);

  const tabs = [
    { id: 'vente', icon: Home, label: 'Accueil' },
    { id: 'location', icon: Search, label: 'Recherche' },
    { id: 'explore', icon: Car, label: 'Explorer' },
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
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-all ${
                isActive ? 'text-primary' : 'text-white/70'
              }`}
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  isActive ? 'text-primary' : 'text-white/70'
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-primary font-medium' : 'text-white/70'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Center action button with gradient */}
        <button className="flex flex-col items-center justify-center -mt-8 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
          <ShoppingCart className="h-6 w-6 text-white" />
        </button>

        <button className="flex flex-col items-center gap-1 px-3 py-2 text-white/70">
          <Heart className="h-6 w-6" />
          <span className="text-xs text-white/70">Favoris</span>
        </button>

        <button className="flex flex-col items-center gap-1 px-3 py-2 text-white/70">
          <User className="h-6 w-6" />
          <span className="text-xs text-white/70">Profil</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
