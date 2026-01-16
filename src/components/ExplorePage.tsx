import { useState } from 'react';
import { mockCars } from '@/data/mockCars';
import { Car } from '@/types/car';
import { formatPrice, formatMileage } from '@/data/mockCars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Grid,
  List,
  Filter,
  ShoppingCart,
  Car as CarIcon,
} from 'lucide-react';

const ExplorePage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vente' | 'location'>('all');

  // Get unique brands for filter
  const brands = [...new Set(mockCars.map(car => car.brand))];

  // Filter cars based on search term, selected brand and category
  const filteredCars = mockCars.filter(car => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrand ? car.brand === selectedBrand : true;

    // Filter by category: vente (both DIRECT and NO_FACE) or location
    let matchesCategory = true;
    if (selectedCategory === 'vente') {
      // Vente includes all cars (both DIRECT and NO_FACE)
      matchesCategory = car.sellerType === 'DIRECT' || car.sellerType === 'NO_FACE';
    } else if (selectedCategory === 'location') {
      // For location, we'll define specific criteria
      // This could be based on specific features, price range, or other attributes
      // For now, we'll consider all cars as available for location too, but you can customize this
      matchesCategory = true; // All cars can be rented - adjust this logic as needed
    }

    return matchesSearch && matchesBrand && matchesCategory;
  });

  const handleWhatsApp = (car: Car) => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par votre ${car.brand} ${car.model} ${car.year} à ${formatPrice(car.price)} sur CARSTOK.`
    );
    window.open(`https://wa.me/${car.whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="pt-16 pb-24 px-4 bg-background min-h-screen">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
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
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Toutes les marques</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Tous</option>
            <option value="vente">Vente</option>
            <option value="location">Location</option>
          </select>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <p className="text-sm text-muted-foreground">
              Total: {filteredCars.length} véhicule{filteredCars.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-primary">
              Vente: {filteredCars.filter(car => (car.sellerType === 'DIRECT' || car.sellerType === 'NO_FACE')).length}
            </p>
            <p className="text-sm text-red-400">
              Location: {filteredCars.length} {/* All cars can potentially be rented */}
            </p>
          </div>

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

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    <span>{formatMileage(car.mileage)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    <span className="capitalize">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
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
                  Contacter via WhatsApp
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

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground my-2">
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    <span>{formatMileage(car.mileage)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    <span className="capitalize">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
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
                  Contacter via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun véhicule trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;