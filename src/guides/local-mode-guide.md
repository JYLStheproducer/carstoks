# Guide: Exécuter Cartok sans serveur en utilisant des photos locales

Ce guide explique comment modifier l'application Cartok pour qu'elle fonctionne sans serveur en utilisant des photos locales stockées dans le projet.

## 1. Remplacer les données distantes par des données locales

### A. Créer un dossier pour les images locales
Créez un dossier `public/cars` dans votre projet et placez-y vos images de véhicules :

```
public/
  └── cars/
      ├── mercedes-e300.jpg
      ├── toyota-landcruiser.jpg
      ├── bmw-x5.jpg
      └── ...
```

### B. Mettre à jour les données de test
Modifiez le fichier `src/data/mockCars.ts` pour utiliser des chemins vers vos images locales :

```typescript
import { Car } from '@/types/car';

export const mockCars: Car[] = [
  {
    id: '1',
    brand: 'Mercedes-Benz',
    model: 'Classe E 300',
    year: 2022,
    price: 45000000,
    originalPrice: 52000000,
    mileage: 28000,
    fuelType: 'essence',
    transmission: 'automatique',
    videoUrl: '/cars/mercedes-e300.jpg',  // Chemin local
    thumbnailUrl: '/cars/mercedes-e300-thumb.jpg',  // Chemin local
    views: 12500,
    elyndraScore: 94,
    location: 'Libreville',
    sellerType: 'DIRECT',
    features: ['Cuir', 'Toit ouvrant', 'Camera 360°', 'Navigation'],
    createdAt: new Date('2024-01-10'),
    whatsappNumber: '+24177123456',
    color: 'Noir',
  },
  // ... autres voitures
];
```

## 2. Désactiver les appels à Supabase

### A. Créer un service de données local
Créez un nouveau fichier `src/services/localData.ts` :

```typescript
import { Car } from '@/types/car';
import { mockCars } from '@/data/mockCars';

// Service pour gérer les données localement sans serveur
export class LocalDataService {
  static async getCars(): Promise<Car[]> {
    // Retourne les données de test locales
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCars), 300); // Simuler un délai réseau
    });
  }

  static async getCarById(id: string): Promise<Car | undefined> {
    return new Promise(resolve => {
      setTimeout(() => {
        const car = mockCars.find(car => car.id === id);
        resolve(car);
      }, 300);
    });
  }

  static async addView(carId: string): Promise<void> {
    // Dans une version locale, on ne fait rien ou on simule l'ajout
    console.log(`Vue ajoutée pour le véhicule ${carId}`);
  }
}
```

### B. Mettre à jour le composant VideoFeed
Modifiez `src/components/VideoFeed.tsx` pour utiliser les données locales :

```typescript
import { useState, useRef, useEffect } from 'react';
import { LocalDataService } from '@/services/localData'; // Importer le service local
import CarTok from './CarTok';
import BackgroundTransition from './BackgroundTransition';

interface VideoFeedProps {
  feedType?: 'sales' | 'rental';
}

const VideoFeed = ({ feedType = 'sales' }: VideoFeedProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cars, setCars] = useState<any[]>([]); // Remplacez par le bon type
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    // Charger les données locales au lieu d'appeler Supabase
    const loadCars = async () => {
      const loadedCars = await LocalDataService.getCars();
      setCars(loadedCars);
    };
    
    loadCars();
  }, []);

  // Filtrer les voitures selon le type si nécessaire
  const carsToDisplay = feedType === 'sales'
    ? cars.filter(car => car.sellerType === 'DIRECT' || car.sellerType === 'NO_FACE')
    : cars; // Pour la location, afficher toutes les voitures

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

    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex, carsToDisplay.length]);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-screen w-full snap-y snap-mandatory overflow-y-scroll relative"
    >
      <BackgroundTransition feedType={feedType} />
      {carsToDisplay.map((car, index) => (
        <div
          key={car.id}
          className="h-screen w-full snap-start pb-32"
        >
          <CarTok car={car} isActive={index === activeIndex} feedType={feedType} />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
```

## 3. Désactiver Supabase dans les composants

### A. Mettre à jour le composant CarTok
Modifiez `src/components/CarTok.tsx` pour désactiver les appels à Supabase :

```typescript
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Phone, Video, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocalDataService } from '@/services/localData'; // Service local

interface CarTokProps {
  car: any; // Remplacez par le bon type
  isActive: boolean;
  feedType?: 'sales' | 'rental';
}

const CarTok = ({ car, isActive, feedType }: CarTokProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Simuler les likes localement
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Simuler l'ajout d'une vue localement
  useEffect(() => {
    if (isActive) {
      // Simuler l'ajout d'une vue
      LocalDataService.addView(car.id);
    }
  }, [isActive, car.id]);

  return (
    <div className="relative h-full w-full">
      {/* Arrière-plan vidéo/image */}
      <div className="absolute inset-0">
        {car.videoUrl?.endsWith('.mp4') ? (
          <video
            src={car.videoUrl}
            autoPlay={isActive}
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={car.videoUrl}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Overlay d'information */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pt-16">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-20">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                {car.elyndraScore}/100
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                {car.sellerType}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white">
              {car.brand} {car.model}
            </h2>
            
            <p className="text-lg font-semibold text-primary">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0,
              }).format(car.price)}
              {car.originalPrice && car.originalPrice > car.price && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XAF',
                    minimumFractionDigits: 0,
                  }).format(car.originalPrice)}
                </span>
              )}
            </p>
            
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{car.year}</span>
              <span>•</span>
              <span>{Math.round(car.mileage / 1000)}k km</span>
              <span>•</span>
              <span>{car.fuelType}</span>
              <span>•</span>
              <span>{car.transmission}</span>
              <span>•</span>
              <span>{car.location}</span>
            </div>
            
            {car.features && car.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {car.features.slice(0, 4).map((feature: string, idx: number) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-white"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutons d'action à droite */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        {/* Bouton de contact */}
        {car.sellerType === 'DIRECT' && car.whatsappNumber && (
          <a 
            href={`https://wa.me/${car.whatsappNumber.replace(/\D/g, '')}`} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col items-center gap-1 p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
              <Phone className="h-6 w-6 text-white" />
              <span className="text-xs text-white">Contacter</span>
            </div>
          </a>
        )}
        
        {/* Bouton de like */}
        <button 
          onClick={handleLike}
          className="flex flex-col items-center gap-1 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <Heart 
            className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
          />
          <span className="text-xs text-white">{likeCount}</span>
        </button>
        
        {/* Bouton de partage */}
        <button className="flex flex-col items-center gap-1 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
          <Share2 className="h-6 w-6 text-white" />
          <span className="text-xs text-white">Partager</span>
        </button>
      </div>
    </div>
  );
};

export default CarTok;
```

## 4. Désactiver les fonctionnalités liées à Supabase

### A. Créer une configuration pour le mode local
Créez un fichier `src/config/appConfig.ts` :

```typescript
// Configuration de l'application
export const AppConfig = {
  // Mode d'exécution
  isLocalMode: true, // Mettez à false pour utiliser Supabase
  
  // Paramètres pour le mode local
  local: {
    enableMockData: true,
    mockDelay: 300, // Délai de simulation en ms
  },
  
  // Paramètres pour le mode serveur
  server: {
    enableRealData: false,
    apiEndpoint: process.env.VITE_API_ENDPOINT || 'http://localhost:3000/api',
  }
};
```

### B. Mettre à jour le composant principal
Modifiez `src/App.tsx` pour utiliser la configuration :

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import { AppConfig } from './config/appConfig';

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={AppConfig.isLocalMode ? <div>Mode local: Administration désactivée</div> : <Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
```

## 5. Instructions pour exécuter l'application en mode local

1. Placez toutes vos images de véhicules dans le dossier `public/cars/`
2. Mettez à jour le fichier `src/data/mockCars.ts` avec vos données
3. Assurez-vous que `AppConfig.isLocalMode` est défini sur `true`
4. Exécutez l'application avec :

```bash
npm install
npm run dev
```

## 6. Avantages du mode local

- Pas besoin de serveur ou de base de données externe
- Chargement rapide des données
- Fonctionne hors-ligne
- Idéal pour le développement et les démonstrations
- Moins de dépendances externes

## 7. Limitations du mode local

- Les données ne sont pas persistantes
- Pas de fonctionnalités de gestion à distance
- Impossible d'avoir des données en temps réel
- Limité à la consultation seule

Ce mode est parfait pour tester l'interface utilisateur, présenter le concept ou pour un usage hors-ligne limité.