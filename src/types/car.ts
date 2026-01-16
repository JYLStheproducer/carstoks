export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  fuelType: 'essence' | 'diesel' | 'hybride' | 'electrique';
  transmission: 'automatique' | 'manuelle';
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  elyndraScore: number; // Trend score 0-100
  location: 'Libreville' | 'Port-Gentil';
  sellerType: 'NO_FACE' | 'DIRECT';
  features: string[];
  createdAt: Date;
  whatsappNumber: string;
}

export interface SellerAccount {
  id: string;
  type: 'NO_FACE' | 'DIRECT';
  commission?: number; // For NO_FACE
  serviceFee?: number; // For DIRECT
}
