import React from 'react';
import { Heart, Share, User, ChevronLeft, Fuel, Gauge, Settings, ShoppingCart } from 'lucide-react';

interface CarDetailProps {
  car: {
    brand: string;
    model: string;
    year: number;
    location: string;
    price: number;
    originalPrice?: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    thumbnailUrl: string;
    features: string[];
    color: string;
  };
  onGoBack?: () => void;
  onShowProfile?: () => void;
}

const CarDetailView: React.FC<CarDetailProps> = ({ car, onGoBack, onShowProfile }) => {
  // Formatage du prix
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-GA', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price) + ' FCFA';
  };

  // Formatage du kilométrage
  const formatMileage = (km: number): string => {
    return new Intl.NumberFormat('fr-GA').format(km) + ' km';
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      {/* 1. Header Épuré */}
      <header className="flex justify-between items-center p-4 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <button 
          onClick={onGoBack}
          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-4">
          <button className="p-2 bg-white/5 rounded-full"><Heart size={20} /></button>
          <button className="p-2 bg-white/5 rounded-full"><Share size={20} /></button>
          <button 
            className="p-2 bg-white/5 rounded-full"
            onClick={onShowProfile}
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section (Image du véhicule) */}
      <section className="relative w-full h-64 bg-zinc-900">
        <img 
          src={car.thumbnailUrl} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* 3. Informations Véhicule */}
      <main className="px-6 -mt-4 relative z-10">
        <h1 className="text-2xl font-bold mb-1">{car.brand} {car.model}</h1>
        <div className="flex items-center gap-3 text-zinc-400 text-sm mb-4">
          <span>📅 {car.year}</span>
          <span>•</span>
          <span>📍 {car.location}</span>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-extrabold text-pink-500">{formatPrice(car.price)}</span>
          {car.originalPrice && (
            <span className="text-lg text-zinc-500 line-through">{formatPrice(car.originalPrice)}</span>
          )}
        </div>

        {/* 4. Badges Techniques (Grille épurée) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <Gauge size={18} className="text-pink-500 mb-1" />
            <span className="text-[10px] uppercase text-zinc-500">Km</span>
            <span className="text-xs font-semibold">{formatMileage(car.mileage)}</span>
          </div>
          <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <Fuel size={18} className="text-pink-500 mb-1" />
            <span className="text-[10px] uppercase text-zinc-500">Carburant</span>
            <span className="text-xs font-semibold capitalize">{car.fuelType}</span>
          </div>
          <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <Settings size={18} className="text-pink-500 mb-1" />
            <span className="text-[10px] uppercase text-zinc-500">Boîte</span>
            <span className="text-xs font-semibold capitalize">{car.transmission}</span>
          </div>
        </div>

        {/* Section détails additionnels */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Détails</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-zinc-500 block">Couleur</span>
              <span className="text-sm font-semibold">{car.color}</span>
            </div>
            <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-zinc-500 block">Équipements</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {car.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="text-xs bg-pink-900/30 text-pink-300 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
                {car.features.length > 3 && (
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                    +{car.features.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Bouton d'achat fixe */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-black/60 backdrop-blur-xl border-t border-white/10 flex flex-col gap-3">
        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95">
          <ShoppingCart size={20} />
          Acheter maintenant
        </button>
      </footer>
    </div>
  );
};

export default CarDetailView;