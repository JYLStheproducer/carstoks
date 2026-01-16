import { CarWithOwner, UserProfile, mockCars } from '@/data/mockCars';

// Service pour gérer les données localement sans serveur
export class LocalDataService {
  static async getCars(): Promise<CarWithOwner[]> {
    // Retourne les données de test locales
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCars), 300); // Simuler un délai réseau
    });
  }

  static async getCarById(id: string): Promise<CarWithOwner | undefined> {
    return new Promise(resolve => {
      setTimeout(() => {
        const car = mockCars.find(car => car.id === id);
        resolve(car);
      }, 300);
    });
  }

  static async getCarsByOwnerId(ownerId: string): Promise<CarWithOwner[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const cars = mockCars.filter(car => car.ownerId === ownerId);
        resolve(cars);
      }, 300);
    });
  }

  static async getOwnerProfile(ownerId: string): Promise<UserProfile | undefined> {
    return new Promise(resolve => {
      setTimeout(() => {
        const car = mockCars.find(car => car.ownerId === ownerId);
        resolve(car?.ownerProfile);
      }, 300);
    });
  }

  static async getAllOwners(): Promise<UserProfile[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const ownersMap = new Map();
        mockCars.forEach(car => {
          if (!ownersMap.has(car.ownerId)) {
            ownersMap.set(car.ownerId, car.ownerProfile);
          }
        });
        resolve(Array.from(ownersMap.values()));
      }, 300);
    });
  }

  static async addView(carId: string): Promise<void> {
    // Dans une version locale, on ne fait rien ou on simule l'ajout
    console.log(`Vue ajoutée pour le véhicule ${carId}`);
  }
}