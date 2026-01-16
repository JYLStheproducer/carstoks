import { useState } from 'react';
import { Car, ShoppingCart, Search } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'vente' | 'location' | 'recherche';
  onTabChange: (tab: 'vente' | 'location' | 'recherche') => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-transparent backdrop-blur-sm py-4">
      <div className="flex justify-center gap-24">
        <button
          onClick={() => onTabChange('vente')}
          className={`flex flex-col items-center transition-all duration-300 ${
            activeTab === 'vente'
              ? 'text-[#FF0080]'
              : 'text-[#808080] hover:text-[#FF0080]'
          }`}
        >
          <div className={`p-3 rounded-full transition-all ${
            activeTab === 'vente'
              ? 'bg-[#FF0080]/20 border border-[#FF0080]'
              : 'bg-transparent'
          }`}>
            <ShoppingCart size={36} />
          </div>
          <span className={`text-xs mt-1 transition-opacity ${
            activeTab === 'vente' ? 'opacity-100 text-[#FF0080]' : 'opacity-70 text-[#808080]'
          }`}>
            Vente
          </span>
        </button>

        <button
          onClick={() => onTabChange('location')}
          className={`flex flex-col items-center transition-all duration-300 ${
            activeTab === 'location'
              ? 'text-[#FF0080]'
              : 'text-[#808080] hover:text-[#FF0080]'
          }`}
        >
          <div className={`p-3 rounded-full transition-all ${
            activeTab === 'location'
              ? 'bg-[#FF0080]/20 border border-[#FF0080]'
              : 'bg-transparent'
          }`}>
            <Car size={36} />
          </div>
          <span className={`text-xs mt-1 transition-opacity ${
            activeTab === 'location' ? 'opacity-100 text-[#FF0080]' : 'opacity-70 text-[#808080]'
          }`}>
            Location
          </span>
        </button>

        <button
          onClick={() => onTabChange('recherche')}
          className={`flex flex-col items-center transition-all duration-300 ${
            activeTab === 'recherche'
              ? 'text-[#FF0080]'
              : 'text-[#808080] hover:text-[#FF0080]'
          }`}
        >
          <div className={`p-3 rounded-full transition-all ${
            activeTab === 'recherche'
              ? 'bg-[#FF0080]/20 border border-[#FF0080]'
              : 'bg-transparent'
          }`}>
            <Search size={36} />
          </div>
          <span className={`text-xs mt-1 transition-opacity ${
            activeTab === 'recherche' ? 'opacity-100 text-[#FF0080]' : 'opacity-70 text-[#808080]'
          }`}>
            Recherche
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;