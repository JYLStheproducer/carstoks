import { CarWithOwner } from '@/data/mockCars';
import { MapPin, Calendar, Gauge, Fuel, Settings, ShoppingCart } from 'lucide-react';
import { formatPrice, formatMileage } from '@/data/mockCars';

interface CarTokProps {
  car: CarWithOwner;
  isActive: boolean;
  feedType?: 'sales' | 'rental';
  onShowProfile?: (ownerId: string) => void;
  onChangeFeedType?: (type: 'sales' | 'rental') => void;
}

const CarTokComponent = ({ car, isActive, feedType = 'sales', onShowProfile, onChangeFeedType }: CarTokProps) => {
  return (
    <div className="relative h-full w-full bg-[#0A0A0A]">
      <div className="relative h-full w-full">
        {/* Image principale avec overlay */}
        <img
          src={car.thumbnailUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]"></div>
        
        {/* Header avec logo et badge de statut */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-bold text-lg">CT</span>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          {/* Titre */}
          <h1 className="text-2xl font-bold text-white mb-2">
            {car.brand} {car.model}
          </h1>
          
          {/* Métadonnées */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-[#FF0080]">
              <MapPin size={16} />
              <span className="text-[#B3B3B3] text-sm">{car.location}</span>
            </div>
            <div className="flex items-center gap-1 text-[#FF0080]">
              <Calendar size={16} />
              <span className="text-[#B3B3B3] text-sm">{car.year}</span>
            </div>
            <div className="flex items-center gap-1 text-[#FF0080]">
              <Gauge size={16} />
              <span className="text-[#B3B3B3] text-sm">{formatMileage(car.mileage)}</span>
            </div>
          </div>
          
          {/* Prix */}
          <div className="text-3xl font-bold text-[#FF0080] mb-4">
            {formatPrice(car.price)}
          </div>
          
          {/* Spécifications */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Gauge size={18} className="text-[#FF0080]" />
              <div>
                <div className="text-xs text-[#808080]">Kilométrage</div>
                <div className="text-sm text-white">{formatMileage(car.mileage)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Fuel size={18} className="text-[#FF0080]" />
              <div>
                <div className="text-xs text-[#808080]">Carburant</div>
                <div className="text-sm text-white capitalize">{car.fuelType}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-[#FF0080]" />
              <div>
                <div className="text-xs text-[#808080]">Transmission</div>
                <div className="text-sm text-white capitalize">{car.transmission}</div>
              </div>
            </div>
          </div>
          
          {/* Bouton d'action */}
          <button className="w-full bg-gradient-to-r from-[#FF0080] to-[#FF3399] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(255,0,128,0.3)] hover:shadow-[0_4px_20px_rgba(255,0,128,0.5)] hover:translate-y-[-2px] transition-all duration-300">
            <ShoppingCart size={20} />
            {feedType === 'rental' ? 'Louer maintenant' : 'Acheter maintenant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarTokComponent;