import { useState, useEffect } from 'react';
import { CarWithOwner } from '@/data/mockCars';
import { formatPrice, formatMileage, formatViews } from '@/data/mockCars';
import { Button } from '@/components/ui/button';
import { DataService } from '@/services/DataService';
import {
  Eye,
  TrendingUp,
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  MessageCircle,
  ChevronDown,
  User,
  Briefcase
} from 'lucide-react';

interface CarTokProps {
  car: CarWithOwner;
  isActive: boolean;
  feedType?: 'sales' | 'rental';
  onShowProfile?: (ownerId: string) => void; // Nouvelle prop pour afficher le profil
}

const CarTok = ({ car, isActive, feedType = 'sales', onShowProfile }: CarTokProps) => {
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
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        <img
          src={car.thumbnailUrl}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover"
        />
        <div className="video-overlay absolute inset-0" />
      </div>

      {/* Right Action Bar */}
      <div className="absolute bottom-20 right-4 z-10 flex flex-col items-center gap-4 sm:gap-5"> {/* Positioned on the right side like TikTok - adjusted for new card position */}
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-2 transition-transform active:scale-95 relative btn-hover btn-active pulse"
        >
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-whatsapp shadow-xl">
            <MessageCircle className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
          </div>
          <span className="absolute -bottom-6 text-xs text-white font-medium bg-primary/20 px-2 py-1 rounded-full">Négocier</span>
        </button>
      </div>

      {/* Profil du propriétaire au-dessus du bouton négocier */}
      <div
        className="absolute bottom-44 right-4 z-10 cursor-pointer" // Positionné au-dessus du bouton négocier
        onClick={() => onShowProfile && onShowProfile(car.ownerId)}
      >
        <div className="relative">
          <img
            src={car.ownerProfile.profilePicture}
            alt={car.ownerProfile.name}
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          {car.ownerProfile.isDealer && (
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
              <Briefcase className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Card - TikTok style - Positioned lower */}
      <div className="safe-bottom absolute bottom-16 left-0 right-0 z-10 px-3 sm:px-4 pb-3 sm:pb-4">
        <div
          className={`glass-dark/89 slide-up overflow-hidden rounded-2xl border border-border/30 transition-all duration-300 ${
            showDetails ? 'max-h-[60vh]' : 'max-h-64' // Increased max height for better visibility
          }`}
        >
          <div className="p-4 sm:p-5">
            {/* Header - Enhanced TikTok style */}
            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-col items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white truncate">
                    {car.brand} {car.model}
                  </h2>
                  {car.sellerType === 'NO_FACE' && (
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs sm:text-sm text-primary flex-shrink-0">
                      Anonyme
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{car.location}</span>
                  </div>
                  <span className="flex-shrink-0 text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{car.year}</span>
                  </div>
                  <span className="flex-shrink-0 text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{formatMileage(car.mileage)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 w-full">
                <p className="font-display text-2xl sm:text-3xl font-bold text-gradient-gold">
                  {formatPrice(car.price)}
                </p>
                {car.originalPrice && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-through mt-1">
                    <span className="text-red-400">-{Math.round((1 - car.price/car.originalPrice)*100)}%</span> {formatPrice(car.originalPrice)}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats - Enhanced TikTok style */}
            <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-card/50 backdrop-blur-sm px-3 py-2 min-w-[120px] border border-border/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Gauge className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Kilométrage</span>
                  <span className="text-sm font-medium text-card-foreground truncate">{formatMileage(car.mileage)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-card/50 backdrop-blur-sm px-3 py-2 min-w-[100px] border border-border/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Fuel className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Carburant</span>
                  <span className="text-sm font-medium capitalize text-card-foreground truncate">{car.fuelType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-card/50 backdrop-blur-sm px-3 py-2 min-w-[100px] border border-border/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Transmission</span>
                  <span className="text-sm font-medium capitalize text-card-foreground truncate">{car.transmission}</span>
                </div>
              </div>
            </div>

            {/* Expand Toggle - Removed text */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full items-center justify-center gap-1 text-base sm:text-sm text-muted-foreground transition-colors hover:text-white py-3"
            >
              <ChevronDown className={`h-5 w-5 sm:h-4 sm:w-4 transition-transform flex-shrink-0 ${showDetails ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded Details */}
            {showDetails && (
              <div className="mt-3 sm:mt-4 border-t border-border/30 pt-3 sm:pt-4">
                <h3 className="mb-3 text-base sm:text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs text-primary font-bold">✓</span>
                  </span>
                  Équipements
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-sm text-primary truncate flex items-center gap-1.5"
                    >
                      <span className="h-3 w-3 flex items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        ✓
                      </span>
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Additional details */}
                <div className="pt-3 border-t border-border/30">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-primary font-bold text-xs">HP</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Puissance</span>
                        <span className="text-white font-medium">180 CV</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-primary font-bold text-xs">🎨</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Couleur</span>
                        <span className="text-white font-medium">{car.color || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-primary font-bold text-xs">🚪</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Portes</span>
                        <span className="text-white font-medium">5</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-primary font-bold text-xs">👥</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Places</span>
                        <span className="text-white font-medium">5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarTok;
