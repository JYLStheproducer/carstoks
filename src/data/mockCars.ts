import { Car } from '@/types/car';

// Interface pour les profils des utilisateurs
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profilePicture: string;
  isDealer: boolean; // true pour concessionnaire, false pour particulier
  location: string;
  rating?: number;
  joinDate: Date;
}

// Extension de l'interface Car pour inclure le propriétaire
export interface CarWithOwner extends Car {
  ownerId: string;
  ownerProfile: UserProfile;
}

export const mockCars: CarWithOwner[] = [
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
    videoUrl: '/cars/mercedes-e300.jpg',
    thumbnailUrl: '/cars/mercedes-e300-thumb.jpg',
    views: 12500,
    elyndraScore: 94,
    location: 'Libreville',
    sellerType: 'DIRECT',
    features: ['Cuir', 'Toit ouvrant', 'Camera 360°', 'Navigation'],
    createdAt: new Date('2024-01-10'),
    whatsappNumber: '+24177123456',
    color: 'Noir',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Land Cruiser V8',
    year: 2021,
    price: 65000000,
    mileage: 42000,
    fuelType: 'diesel',
    transmission: 'automatique',
    videoUrl: '/cars/toyota-landcruiser.jpg',
    thumbnailUrl: '/cars/toyota-landcruiser-thumb.jpg',
    views: 8900,
    elyndraScore: 88,
    location: 'Port-Gentil',
    sellerType: 'NO_FACE',
    features: ['4x4', 'Diesel', '7 places', 'Climatisation Bi-Zone'],
    createdAt: new Date('2024-01-08'),
    whatsappNumber: '+24177789012',
    color: 'Blanc',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '3',
    brand: 'BMW',
    model: 'X5 M50i',
    year: 2023,
    price: 78000000,
    originalPrice: 85000000,
    mileage: 15000,
    fuelType: 'essence',
    transmission: 'automatique',
    videoUrl: '/cars/bmw-x5.jpg',
    thumbnailUrl: '/cars/bmw-x5-thumb.jpg',
    views: 15200,
    elyndraScore: 97,
    location: 'Libreville',
    sellerType: 'DIRECT',
    features: ['M Sport Package', 'Harman Kardon', 'Head-Up Display', 'Laser Lights'],
    createdAt: new Date('2024-01-12'),
    whatsappNumber: '+24177345678',
    color: 'Gris',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '4',
    brand: 'Range Rover',
    model: 'Sport HSE',
    year: 2022,
    price: 72000000,
    mileage: 32000,
    fuelType: 'diesel',
    transmission: 'automatique',
    videoUrl: '/cars/range-rover.jpg',
    thumbnailUrl: '/cars/range-rover-thumb.jpg',
    views: 9800,
    elyndraScore: 85,
    location: 'Libreville',
    sellerType: 'NO_FACE',
    features: ['Terrain Response', 'Meridian Sound', 'Air Suspension', 'Panoramic Roof'],
    createdAt: new Date('2024-01-05'),
    whatsappNumber: '+24177567890',
    color: 'Noir',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '5',
    brand: 'Audi',
    model: 'Q7 55 TFSI',
    year: 2023,
    price: 58000000,
    mileage: 18000,
    fuelType: 'essence',
    transmission: 'automatique',
    videoUrl: '/cars/audi-q7.jpg',
    thumbnailUrl: '/cars/audi-q7-thumb.jpg',
    views: 7600,
    elyndraScore: 82,
    location: 'Port-Gentil',
    sellerType: 'DIRECT',
    features: ['S-Line', 'Virtual Cockpit', 'Matrix LED', 'Quattro'],
    createdAt: new Date('2024-01-11'),
    whatsappNumber: '+24177901234',
    color: 'Bleu',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '6',
    brand: 'Honda',
    model: 'CR-V',
    year: 2020,
    price: 28000000,
    mileage: 65000,
    fuelType: 'essence',
    transmission: 'automatique',
    videoUrl: '/cars/honda-crv.jpg',
    thumbnailUrl: '/cars/honda-crv-thumb.jpg',
    views: 11200,
    elyndraScore: 78,
    location: 'Libreville',
    sellerType: 'DIRECT',
    features: ['GPS', 'Caméra de recul', 'Climatisation', 'Sièges chauffants'],
    createdAt: new Date('2024-01-15'),
    whatsappNumber: '+24177234567',
    color: 'Rouge',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '7',
    brand: 'Peugeot',
    model: '3008',
    year: 2021,
    price: 32000000,
    originalPrice: 38000000,
    mileage: 35000,
    fuelType: 'essence',
    transmission: 'automatique',
    videoUrl: '/cars/peugeot-3008.jpg',
    thumbnailUrl: '/cars/peugeot-3008-thumb.jpg',
    views: 8700,
    elyndraScore: 80,
    location: 'Port-Gentil',
    sellerType: 'NO_FACE',
    features: ['Toit ouvrant', 'Pack cuir', 'Navigation', 'Radar de stationnement'],
    createdAt: new Date('2024-01-18'),
    whatsappNumber: '+24177456789',
    color: 'Gris',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '8',
    brand: 'Renault',
    model: 'Captur',
    year: 2022,
    price: 25000000,
    mileage: 25000,
    fuelType: 'essence',
    transmission: 'manuelle',
    videoUrl: '/cars/renault-captur.jpg',
    thumbnailUrl: '/cars/renault-captur-thumb.jpg',
    views: 9300,
    elyndraScore: 75,
    location: 'Franceville',
    sellerType: 'DIRECT',
    features: ['Bluetooth', 'Climatisation', 'Régulateur de vitesse', 'Feux LED'],
    createdAt: new Date('2024-01-20'),
    whatsappNumber: '+24177678901',
    color: 'Blanc',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
  {
    id: '9',
    brand: 'Volkswagen',
    model: 'Golf 7 GTI',
    year: 2023,
    price: 38000000,
    originalPrice: 42000000,
    mileage: 12000,
    fuelType: 'essence',
    transmission: 'manuelle',
    videoUrl: '/cars/vw-golf-gti.jpg',
    thumbnailUrl: '/cars/vw-golf-gti-thumb.jpg',
    views: 7800,
    elyndraScore: 91,
    location: 'Libreville',
    sellerType: 'DIRECT',
    features: ['Toit ouvrant', 'Sièges sport', 'Système audio premium', 'Régulateur adaptatif'],
    createdAt: new Date('2024-01-22'),
    whatsappNumber: '+24177890123',
    color: 'Rouge',
    // Informations du propriétaire
    ownerId: 'carstok',
    ownerProfile: {
      id: 'carstok',
      name: 'CartoK',
      phone: '+24100000000',
      email: 'contact@carstok.ai',
      profilePicture: '/images/logo.png',
      isDealer: true, // CartoK dealer
      location: 'Gabon',
      rating: 4.9,
      joinDate: new Date('2023-01-01')
    }
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-GA', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA';
};

export const formatMileage = (km: number): string => {
  return new Intl.NumberFormat('fr-GA').format(km) + ' km';
};

export const formatViews = (views: number): string => {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
};
