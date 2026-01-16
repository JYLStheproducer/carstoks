import { useState } from 'react';
import VideoFeed from '@/components/VideoFeed';
import Header from '@/components/Header';
import ExplorePage from '@/components/ExplorePage';
import BottomNavigation from '@/components/BottomNavigation';
import SearchOverlay from '@/components/SearchOverlay';
import { DataService } from '@/services/DataService';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'vente' | 'location' | 'recherche'>('vente');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleChangeFeedType = (type: 'sales' | 'rental') => {
    setActiveTab(type === 'sales' ? 'vente' : 'location');
  };

  const handleSearch = async (filters: any) => {
    // Charger tous les véhicules
    const allCars = await DataService.getCars();

    // Appliquer les filtres
    const filteredCars = allCars.filter(car => {
      // Filtre par type de transaction
      const matchesType = activeTab === 'vente'
        ? (car.sellerType === 'DIRECT' || car.sellerType === 'NO_FACE')
        : true; // Pour location, tous les véhicules sont affichés

      // Filtre par marque
      const matchesBrand = !filters.brand || car.brand === filters.brand;

      // Filtre par prix
      const matchesPrice = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];

      // Filtre par année
      const matchesYear = car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1];

      // Filtre par kilométrage
      const matchesMileage = car.mileage >= filters.mileageRange[0] && car.mileage <= filters.mileageRange[1];

      // Filtre par carburant
      const matchesFuel = filters.fuel.length === 0 || filters.fuel.includes(car.fuelType);

      // Filtre par transmission
      const matchesTransmission = !filters.transmission || car.transmission === filters.transmission;

      // Filtre par localisation
      const matchesLocation = !filters.location || car.location === filters.location;

      return matchesType && matchesBrand && matchesPrice && matchesYear &&
             matchesMileage && matchesFuel && matchesTransmission && matchesLocation;
    });

    setSearchResults(filteredCars);
  };

  const renderContent = () => {
    if (activeTab === 'recherche') {
      return (
        <>
          <Header activeTab="recherche" />
          <ExplorePage />
        </>
      );
    }

    return (
      <>
        <Header activeTab={activeTab} />
        <VideoFeed
          feedType={activeTab === 'vente' ? 'sales' : 'rental'}
          onChangeFeedType={(type) => handleChangeFeedType(type)}
        />
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-background">
      {renderContent()}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onApply={handleSearch}
        vehicles={searchResults.length > 0 ? searchResults : []}
      />
    </div>
  );
};

export default Index;
