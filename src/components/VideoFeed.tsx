import { useState, useRef, useEffect } from 'react';
import { DataService } from '@/services/DataService';
import CarTok from './CarTok';
import ProfileOwner from './ProfileOwner';
import BackgroundTransition from './BackgroundTransition';

// Définir les types pour les événements tactiles
declare global {
  interface TouchEvent {
    touches: TouchList;
  }
}

interface VideoFeedProps {
  feedType?: 'sales' | 'rental';
}

const VideoFeed = ({ feedType = 'sales' }: VideoFeedProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProfile, setShowProfile] = useState<string | null>(null); // État pour afficher le profil
  const [cars, setCars] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Charger les voitures au montage du composant
  useEffect(() => {
    const loadCars = async () => {
      const loadedCars = await DataService.getCars();
      setCars(loadedCars);
    };

    loadCars();
  }, []);

  // Filter cars based on feed type if needed
  const carsToDisplay = feedType === 'sales'
    ? cars.filter(car => car.sellerType === 'DIRECT' || car.sellerType === 'NO_FACE')
    : cars; // For rental, show all cars (you can customize this filter as needed)

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < carsToDisplay.length) {
        setActiveIndex(newIndex);
      }
    };

    const handleScrollEnd = () => {
      isScrolling.current = false;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const targetScroll = Math.round(scrollTop / itemHeight) * itemHeight;

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    };

    let scrollTimeout: NodeJS.Timeout;

    const onScroll = () => {
      handleScroll();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 100);
    };

    // Touch event handlers for horizontal swipe
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      // Calculate the difference
      const diffX = touchX - touchStartX.current;
      const diffY = touchY - touchStartY.current;

      // Check if horizontal movement is greater than vertical and if it's a right-to-left swipe
      if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0 && Math.abs(diffX) > 50) {
        // Right to left swipe detected - show profile for current car
        if (carsToDisplay[activeIndex]) {
          setShowProfile(carsToDisplay[activeIndex].ownerId);
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex, carsToDisplay.length]);

  // Gérer l'affichage du profil
  const handleShowProfile = (ownerId: string) => {
    setShowProfile(ownerId);
  };

  // Gérer le retour à la liste
  const handleBackToList = () => {
    setShowProfile(null);
  };

  if (showProfile) {
    // Afficher le profil du propriétaire
    return <ProfileOwner ownerId={showProfile} onBack={handleBackToList} />;
  }

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-screen w-full snap-y snap-mandatory overflow-y-scroll relative"
    >
      <BackgroundTransition feedType={feedType} />
      {carsToDisplay.map((car, index) => (
        <div
          key={car.id}
          className="h-screen w-full snap-start pb-32" // Increased padding at bottom to account for navigation and action buttons
        >
          <CarTok 
            car={car} 
            isActive={index === activeIndex} 
            feedType={feedType}
            onShowProfile={handleShowProfile} // Passer la fonction pour afficher le profil
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;