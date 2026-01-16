import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Star, Briefcase, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataService } from '@/services/DataService';
import { CarWithOwner } from '@/data/mockCars';

interface ProfileOwnerProps {
  ownerId: string;
  onBack: () => void;
}

const ProfileOwner = ({ ownerId, onBack }: ProfileOwnerProps) => {
  const [owner, setOwner] = useState<any>(null);
  const [cars, setCars] = useState<CarWithOwner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const ownerData = await DataService.getOwnerProfile(ownerId);
        const carsData = await DataService.getCarsByOwnerId(ownerId);
        setOwner(ownerData);
        setCars(carsData);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [ownerId]);

  if (loading || !owner) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-white">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* En-tête */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-lg border-b border-border/30 p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-lg font-bold text-white">Profil</h2>
          <div className="w-10"></div> {/* Espace pour alignement */}
        </div>
      </div>

      <div className="pb-20">
        {/* Section profil */}
        <div className="p-6 text-center">
          <div className="relative inline-block">
            <img
              src={owner.profilePicture}
              alt={owner.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary mx-auto"
            />
            {owner.isDealer && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-white mt-3">{owner.name}</h3>
          
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-white">{owner.rating}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{owner.location}</span>
          </div>
          
          <div className="mt-4 flex gap-2 justify-center">
            <a 
              href={`https://wa.me/${owner.phone.replace(/\D/g, '')}`} 
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-500 hover:bg-green-600">
                <Phone className="h-4 w-4 mr-2" />
                Contacter
              </Button>
            </a>
            
            {owner.email && (
              <a href={`mailto:${owner.email}`}>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Section véhicules du propriétaire */}
        <div className="px-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Véhicules ({cars.length})
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {cars.map((car) => (
              <div key={car.id} className="glass-dark rounded-xl p-4">
                <div className="flex gap-4">
                  <img
                    src={car.thumbnailUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-white">{car.brand} {car.model}</h5>
                    <p className="text-primary font-bold">{car.price.toLocaleString()} FCFA</p>
                    <p className="text-xs text-muted-foreground">
                      {car.year} • {car.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOwner;