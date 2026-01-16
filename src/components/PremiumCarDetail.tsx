import { useState, useEffect } from 'react';
import { CarWithOwner } from '@/data/mockCars';
import { formatPrice, formatMileage, formatViews } from '@/data/mockCars';
import { Button } from '@/components/ui/button';
import { DataService } from '@/services/DataService';
import {
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Heart,
  Share,
  User,
  Briefcase,
  MessageCircle,
  ShoppingCart
} from 'lucide-react';

interface PremiumCarDetailProps {
  car: CarWithOwner;
  isActive: boolean;
  feedType?: 'sales' | 'rental';
  onShowProfile?: (ownerId: string) => void;
}

const PremiumCarDetail = ({ car, isActive, feedType = 'sales', onShowProfile }: PremiumCarDetailProps) => {
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
      <div className="relative h-2/5">
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
          {/* Logo CT only */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 shadow-lg bg-white/10 backdrop-blur-md">
            <span className="text-xl font-bold text-white">CT</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg">
            <Heart className="h-5 w-5 text-white" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg">
            <Share className="h-5 w-5 text-white" />
          </button>
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg"
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
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
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
            <p className="text-2xl md:text-3xl font-bold text-[#E91E63]">
              {formatPrice(car.price)}
            </p>
            {car.originalPrice && (
              <p className="text-lg text-white/60 line-through">
                {formatPrice(car.originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Characteristics - Minimalist badges */}
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full">
              <Gauge className="h-4 w-4 text-white" />
              <span className="text-sm text-white">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full">
              <Fuel className="h-4 w-4 text-white" />
              <span className="text-sm text-white capitalize">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full">
              <Calendar className="h-4 w-4 text-white" />
              <span className="text-sm text-white capitalize">{car.transmission}</span>
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

      {/* Floating Action Button - Acheter maintenant */}
      <div className="absolute bottom-24 left-4 right-4 z-20">
        <Button 
          onClick={handleWhatsApp}
          className="w-full py-6 rounded-xl bg-[#E91E63] hover:bg-[#D81B60] text-lg font-bold shadow-lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Acheter maintenant
        </Button>
      </div>

      {/* Floating Bottom Navigation with Glassmorphism */}
      <nav className="safe-bottom absolute bottom-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-4 py-3">
          <button className="flex flex-col items-center gap-1 text-white/70">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Accueil</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-white/70">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">Recherche</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-[#E91E63]">
            <ShoppingCart className="h-8 w-8 bg-[#E91E63]/20 rounded-full p-1.5" />
            <span className="text-xs text-[#E91E63] font-medium">Acheter</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-white/70">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">Favoris</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-white/70">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default PremiumCarDetail;