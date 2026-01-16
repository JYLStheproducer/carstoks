import { CarWithOwner } from '@/data/mockCars';
import { formatPrice, formatMileage } from '@/data/mockCars';
import { Button } from '@/components/ui/button';
import { MapPin, Fuel, Gauge, Calendar } from 'lucide-react';

interface MiniVehicleCardProps {
  vehicle: CarWithOwner;
  onClick: () => void;
}

const MiniVehicleCard = ({ vehicle, onClick }: MiniVehicleCardProps) => {
  return (
    <div 
      className="bg-card rounded-xl overflow-hidden border border-border/30 transition-all hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={vehicle.thumbnailUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          {vehicle.elyndraScore}%
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-white text-sm">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.location}</p>
          </div>
          <p className="font-bold text-primary text-sm">{formatPrice(vehicle.price)}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
        </div>

        <Button className="w-full" size="sm">
          Voir détails
        </Button>
      </div>
    </div>
  );
};

export default MiniVehicleCard;