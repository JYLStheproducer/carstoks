import { useState } from 'react';
import { Car, MapPin, Users, DollarSign, Star, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCars } from '@/data/mockCars';
import { Car as CarType } from '@/types/car';
import { formatPrice } from '@/data/mockCars';

const CarLocationSpace = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // Get unique locations and brands for filters
  const locations = [...new Set(mockCars.map(car => car.location))];
  const brands = [...new Set(mockCars.map(car => car.brand))];
  
  // Filter cars based on search term, location and brand
  const filteredCars = mockCars.filter(car => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation ? car.location === selectedLocation : true;
    const matchesBrand = selectedBrand ? car.brand === selectedBrand : true;
    
    return matchesSearch && matchesLocation && matchesBrand;
  });

  const handleWhatsApp = (car: CarType) => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par votre ${car.brand} ${car.model} ${car.year} à ${formatPrice(car.price)} sur CARSTOK.`
    );
    window.open(`https://wa.me/${car.whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="pt-16 pb-24 px-4 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white mb-2">Espace Location</h1>
        <p className="text-sm text-muted-foreground">Louez la voiture parfaite pour votre séjour</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Rechercher une marque, modèle ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border/50"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Toutes les villes</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Toutes les marques</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {filteredCars.length} véhicule{filteredCars.length > 1 ? 's' : ''} disponible{filteredCars.length > 1 ? 's' : ''}
          </p>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Location Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-dark rounded-xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Villes desservies</p>
            <p className="font-bold text-white">{locations.length}</p>
          </div>
        </div>
        
        <div className="glass-dark rounded-xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Véhicules disponibles</p>
            <p className="font-bold text-white">{mockCars.length}</p>
          </div>
        </div>
        
        <div className="glass-dark rounded-xl p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
            <Star className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
            <p className="font-bold text-white">4.8/5</p>
          </div>
        </div>
      </div>

      {/* Cars Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCars.map((car) => (
            <div 
              key={car.id} 
              className="bg-card rounded-xl overflow-hidden border border-border/30 transition-all hover:shadow-lg"
            >
              <div className="relative">
                <img 
                  src={car.thumbnailUrl} 
                  alt={`${car.brand} ${car.model}`} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {car.elyndraScore}%
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white">{car.brand} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">{car.year} • {car.location}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{formatPrice(car.price)}</p>
                </div>
                
                <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <span>{car.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{car.transmission}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {car.features.slice(0, 3).map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{car.features.length - 3} autres
                    </span>
                  )}
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleWhatsApp(car)}
                >
                  Louer via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCars.map((car) => (
            <div 
              key={car.id} 
              className="bg-card rounded-xl overflow-hidden border border-border/30 flex gap-4 p-4"
            >
              <img 
                src={car.thumbnailUrl} 
                alt={`${car.brand} ${car.model}`} 
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-white">{car.brand} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">{car.year} • {car.location}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{formatPrice(car.price)}</p>
                </div>
                
                <div className="flex gap-3 text-xs text-muted-foreground my-2">
                  <div className="flex items-center gap-1">
                    <span>{car.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{car.transmission}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {car.features.slice(0, 3).map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{car.features.length - 3} autres
                    </span>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => handleWhatsApp(car)}
                >
                  Louer via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun véhicule disponible</p>
        </div>
      )}
    </div>
  );
};

export default CarLocationSpace;