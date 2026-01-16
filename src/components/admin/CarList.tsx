import { Trash2, Edit, Eye, EyeOff, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice, formatMileage } from '@/data/mockCars';
import type { CarData } from './AdminDashboard';

interface CarListProps {
  cars: CarData[];
  isLoading: boolean;
  onEdit: (car: CarData) => void;
  onDelete: (carId: string) => void;
  onToggleActive: (carId: string, isActive: boolean) => void;
}

const CarList = ({ cars, isLoading, onEdit, onDelete, onToggleActive }: CarListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Aucun véhicule dans le catalogue</p>
        <p className="text-sm text-muted-foreground mt-1">
          Cliquez sur "Ajouter un véhicule" pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 space-y-4">
      {cars.map((car) => {
        const primaryMedia = car.car_media?.find(m => m.is_primary) || car.car_media?.[0];
        
        return (
          <div
            key={car.id}
            className={`glass-dark rounded-xl overflow-hidden ${!car.is_active ? 'opacity-60' : ''}`}
          >
            <div className="flex">
              {/* Thumbnail */}
              <div className="w-24 h-24 flex-shrink-0 bg-card">
                {primaryMedia ? (
                  primaryMedia.media_type === 'video' ? (
                    <video
                      src={primaryMedia.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={primaryMedia.url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {car.year} • {formatMileage(car.mileage)} • {car.fuel_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-bold text-sm block">
                      {formatPrice(car.price)}
                    </span>
                    {car.original_price && car.original_price > car.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(car.original_price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    car.seller_type === 'DIRECT'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {car.seller_type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {car.views} vues
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Score: {car.elyndra_score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {car.location}
                  </span>
                </div>

                {car.features && car.features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {car.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{car.features.length - 3} autre(s)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-border/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(car)}
                className="flex-1 rounded-none text-muted-foreground hover:text-white"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleActive(car.id, car.is_active)}
                className="flex-1 rounded-none text-muted-foreground hover:text-white border-x border-border/30"
              >
                {car.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Masquer
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Afficher
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(car.id)}
                className="flex-1 rounded-none text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CarList;
