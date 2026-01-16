import { useState, useEffect } from 'react';
import { CarWithOwner } from '@/data/mockCars';
import { formatPrice, formatMileage } from '@/data/mockCars';
import { Button } from '@/components/ui/button';
import { DataService } from '@/services/DataService';
import {
  Heart,
  Share,
  User,
  ShoppingCart,
  ChevronLeft,
  Fuel,
  Gauge,
  Calendar
} from 'lucide-react';

interface CarTokProps {
  car: CarWithOwner;
  isActive: boolean;
  feedType?: 'sales' | 'rental';
  onShowProfile?: (ownerId: string) => void;
  onGoBack?: () => void;
}

const CarTok = ({ car, isActive, feedType = 'sales', onShowProfile, onGoBack }: CarTokProps) => {
  // Apply red theme when on rental feed
  useEffect(() => {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      if (feedType === 'rental') {
        document.documentElement.classList.add('location-theme');
      } else {
        document.documentElement.classList.remove('location-theme');
      }
    }
  }, [feedType]);

  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWhatsApp = () => {
    const actionText = feedType === 'rental' ? 'louer' : 'acheter';
    const message = encodeURIComponent(
      `Bonjour, je souhaite ${actionText} votre ${car.brand} ${car.model} ${car.year} à ${formatPrice(car.price)} sur CARSTOK.`
    );
    window.open(`https://wa.me/${car.whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  // Simuler l'ajout d'une vue localement
  useEffect(() => {
    if (isActive) {
      // Simuler l'ajout d'une vue
      DataService.addView(car.id);
    }
  }, [isActive, car.id]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* Hero Section - Image with skeleton loader */}
      <div className="relative h-[35vh]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
        <img
          src={car.thumbnailUrl}
          alt={`${car.brand} ${car.model}`}
          className={`h-full w-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
      </div>

      {/* Header - Clean and Minimal */}
      <header className="safe-top fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button */}
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}

          {/* Logo CT only */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-lg">
            <span className="text-lg font-bold text-white">CT</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-lg">
            <Heart className="h-5 w-5 text-white" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-lg">
            <Share className="h-5 w-5 text-white" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-lg"
            onClick={() => onShowProfile && onShowProfile(car.ownerId)}
          >
            <User className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full pt-4 pb-32">
        {/* Product Title */}
        <div className="px-4 pt-2">
          <h1 className="text-2xl font-bold text-white mb-1">
            {car.brand} {car.model}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
            <span>•</span>
            <Gauge className="h-4 w-4" />
            <span>{formatMileage(car.mileage)}</span>
          </div>
        </div>

        {/* Price with promotional display */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#E91E63]">
              {formatPrice(car.price)}
            </p>
            {car.originalPrice && (
              <p className="text-base text-white/50 line-through">
                {formatPrice(car.originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Characteristics - Simple grid */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-3 gap-3">
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
              <Calendar size={18} className="text-pink-500 mb-1" />
              <span className="text-[10px] uppercase text-zinc-500">Boîte</span>
              <span className="text-xs font-semibold capitalize">{car.transmission}</span>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <div className="px-4 py-3 flex-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-md rounded-xl text-white"
          >
            <span>Détails et équipements</span>
            <svg
              className={`h-5 w-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDetails && (
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                <h3 className="font-semibold text-white mb-2">Équipements</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-white"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                  <span className="text-xs text-white/60 block">Couleur</span>
                  <span className="text-white font-medium">{car.color || 'N/A'}</span>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                  <span className="text-xs text-white/60 block">Portes</span>
                  <span className="text-white font-medium">5</span>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                  <span className="text-xs text-white/60 block">Places</span>
                  <span className="text-white font-medium">5</span>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                  <span className="text-xs text-white/60 block">Puissance</span>
                  <span className="text-white font-medium">180 CV</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed purchase button at bottom */}
      <div className="fixed bottom-4 left-4 right-4 z-20 px-4">
        <Button
          onClick={handleWhatsApp}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <ShoppingCart size={20} />
          Acheter maintenant
        </Button>
      </div>
    </div>
  );
};

export default CarTok;
