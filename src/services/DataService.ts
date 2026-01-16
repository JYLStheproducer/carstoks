import { CarWithOwner, UserProfile, mockCars } from '@/data/mockCars';
import { AppConfig } from '@/config/appConfig';

// Service pour gérer les données localement ou via Supabase
export class DataService {
  static async getCars(): Promise<CarWithOwner[]> {
    if (AppConfig.isLocalMode || !AppConfig.local.enableMockData) {
      // Utiliser les données locales
      return new Promise(resolve => {
        setTimeout(() => resolve(mockCars), AppConfig.local.mockDelay);
      });
    } else {
      // Ici, vous pouvez ajouter la logique pour récupérer les données via Supabase
      // Exemple:
      // const { data, error } = await supabase.from('cars').select('*');
      // if (error) throw error;
      // return data as CarWithOwner[];
      
      // Pour le moment, on retourne les données locales
      return mockCars;
    }
  }

  static async getCarById(id: string): Promise<CarWithOwner | undefined> {
    if (AppConfig.isLocalMode || !AppConfig.local.enableMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          const car = mockCars.find(car => car.id === id);
          resolve(car);
        }, AppConfig.local.mockDelay);
      });
    } else {
      // Logique Supabase ici
      return mockCars.find(car => car.id === id);
    }
  }

  static async getCarsByOwnerId(ownerId: string): Promise<CarWithOwner[]> {
    if (AppConfig.isLocalMode || !AppConfig.local.enableMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          const cars = mockCars.filter(car => car.ownerId === ownerId);
          resolve(cars);
        }, AppConfig.local.mockDelay);
      });
    } else {
      // Logique Supabase ici
      return mockCars.filter(car => car.ownerId === ownerId);
    }
  }

  static async getOwnerProfile(ownerId: string): Promise<UserProfile | undefined> {
    if (AppConfig.isLocalMode || !AppConfig.local.enableMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          const car = mockCars.find(car => car.ownerId === ownerId);
          resolve(car?.ownerProfile);
        }, AppConfig.local.mockDelay);
      });
    } else {
      // Logique Supabase ici
      const car = mockCars.find(car => car.ownerId === ownerId);
      return car?.ownerProfile;
    }
  }

  static async getAllOwners(): Promise<UserProfile[]> {
    if (AppConfig.isLocalMode || !AppConfig.local.enableMockData) {
      return new Promise(resolve => {
        setTimeout(() => {
          const ownersMap = new Map();
          mockCars.forEach(car => {
            if (!ownersMap.has(car.ownerId)) {
              ownersMap.set(car.ownerId, car.ownerProfile);
            }
          });
          resolve(Array.from(ownersMap.values()));
        }, AppConfig.local.mockDelay);
      });
    } else {
      // Logique Supabase ici
      const ownersMap = new Map();
      mockCars.forEach(car => {
        if (!ownersMap.has(car.ownerId)) {
          ownersMap.set(car.ownerId, car.ownerProfile);
        }
      });
      return Array.from(ownersMap.values());
    }
  }

  static async addView(carId: string): Promise<void> {
    if (AppConfig.isLocalMode) {
      console.log(`Vue ajoutée pour le véhicule ${carId} en mode local`);
    } else {
      // Logique Supabase ici
      console.log(`Vue ajoutée pour le véhicule ${carId} via Supabase`);
    }
  }
}