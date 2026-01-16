# Configuration de CARSTOK avec Supabase

## 1. Création d'un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit
2. Créez un nouveau projet
3. Notez les informations suivantes :
   - Project URL
   - Anonymous Key (clé publique)
   - Database Password (si vous en avez besoin)

## 2. Configuration des variables d'environnement

Créez ou mettez à jour le fichier `.env` à la racine de votre projet :

```env
VITE_SUPABASE_URL=Votre_Project_URL
VITE_SUPABASE_ANON_KEY=Votre_Anonymous_Key
VITE_SUPABASE_DB_PASSWORD=Votre_Password
```

## 3. Structure de la base de données

Exécutez ces requêtes SQL dans l'éditeur SQL de Supabase pour créer les tables nécessaires :

```sql
-- Table des utilisateurs (propriétaires de véhicules)
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  profile_picture_url TEXT,
  is_dealer BOOLEAN DEFAULT FALSE,
  location TEXT,
  rating NUMERIC DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE
);

-- Table des véhicules
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price BIGINT NOT NULL,
  original_price BIGINT,
  mileage BIGINT NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  color TEXT,
  description TEXT,
  location TEXT,
  seller_type TEXT CHECK (seller_type IN ('DIRECT', 'NO_FACE')),
  seller_phone TEXT,
  views INTEGER DEFAULT 0,
  elyndra_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des médias (photos/vidéos des véhicules)
CREATE TABLE car_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  is_primary BOOLEAN DEFAULT FALSE
);

-- Table des vues
CREATE TABLE car_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  viewer_ip INET,
  user_agent TEXT
);
```

## 4. Configuration du client Supabase

Créez ou mettez à jour le fichier `src/integrations/supabase/client.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

## 5. Mise à jour du service de données

Mettons à jour le service de données pour utiliser Supabase :

```typescript
// src/services/DataService.ts
import { CarWithOwner, UserProfile } from '@/data/mockCars';
import { supabase } from '@/integrations/supabase/client';
import { AppConfig } from '@/config/appConfig';

// Service pour gérer les données localement ou via Supabase
export class DataService {
  static async getCars(): Promise<CarWithOwner[]> {
    if (AppConfig.isLocalMode || !AppConfig.server.enableRealData) {
      // Utiliser les données locales
      return new Promise(resolve => {
        setTimeout(() => resolve([]), AppConfig.local.mockDelay);
      });
    } else {
      // Récupérer les données via Supabase
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          owner:profiles(*),
          car_media (*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cars:', error);
        return [];
      }

      // Transformer les données pour correspondre à CarWithOwner
      return data.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        originalPrice: car.original_price,
        mileage: car.mileage,
        fuelType: car.fuel_type,
        transmission: car.transmission,
        color: car.color,
        description: car.description,
        location: car.location,
        sellerType: car.seller_type,
        whatsappNumber: car.seller_phone,
        views: car.views || 0,
        elyndraScore: car.elyndra_score,
        createdAt: new Date(car.created_at),
        features: [], // Vous pouvez ajouter une table séparée pour les features
        thumbnailUrl: car.car_media?.find(m => m.is_primary)?.url || '',
        videoUrl: car.car_media?.find(m => m.media_type === 'video')?.url || 
                 car.car_media?.[0]?.url || '',
        
        // Propriétaire
        ownerId: car.owner_id,
        ownerProfile: {
          id: car.owner.id,
          name: car.owner.name,
          phone: car.owner.phone || '',
          email: car.owner.email,
          profilePicture: car.owner.profile_picture_url || '/profiles/default.png',
          isDealer: car.owner.is_dealer,
          location: car.owner.location || '',
          rating: car.owner.rating,
          joinDate: new Date(car.owner.join_date)
        }
      }));
    }
  }

  static async getCarById(id: string): Promise<CarWithOwner | undefined> {
    if (AppConfig.isLocalMode || !AppConfig.server.enableRealData) {
      return undefined;
    } else {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          owner:profiles(*),
          car_media (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching car:', error);
        return undefined;
      }

      // Transformer les données pour correspondre à CarWithOwner
      return {
        id: data.id,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        originalPrice: data.original_price,
        mileage: data.mileage,
        fuelType: data.fuel_type,
        transmission: data.transmission,
        color: data.color,
        description: data.description,
        location: data.location,
        sellerType: data.seller_type,
        whatsappNumber: data.seller_phone,
        views: data.views || 0,
        elyndraScore: data.elyndra_score,
        createdAt: new Date(data.created_at),
        features: [],
        thumbnailUrl: data.car_media?.find(m => m.is_primary)?.url || '',
        videoUrl: data.car_media?.find(m => m.media_type === 'video')?.url || 
                 data.car_media?.[0]?.url || '',
        
        // Propriétaire
        ownerId: data.owner_id,
        ownerProfile: {
          id: data.owner.id,
          name: data.owner.name,
          phone: data.owner.phone || '',
          email: data.owner.email,
          profilePicture: data.owner.profile_picture_url || '/profiles/default.png',
          isDealer: data.owner.is_dealer,
          location: data.owner.location || '',
          rating: data.owner.rating,
          joinDate: new Date(data.owner.join_date)
        }
      };
    }
  }

  static async getCarsByOwnerId(ownerId: string): Promise<CarWithOwner[]> {
    if (AppConfig.isLocalMode || !AppConfig.server.enableRealData) {
      return [];
    } else {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          owner:profiles(*),
          car_media (*)
        `)
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cars by owner:', error);
        return [];
      }

      return data.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        originalPrice: car.original_price,
        mileage: car.mileage,
        fuelType: car.fuel_type,
        transmission: car.transmission,
        color: car.color,
        description: car.description,
        location: car.location,
        sellerType: car.seller_type,
        whatsappNumber: car.seller_phone,
        views: car.views || 0,
        elyndraScore: car.elyndra_score,
        createdAt: new Date(car.created_at),
        features: [],
        thumbnailUrl: car.car_media?.find(m => m.is_primary)?.url || '',
        videoUrl: car.car_media?.find(m => m.media_type === 'video')?.url || 
                 car.car_media?.[0]?.url || '',
        
        // Propriétaire
        ownerId: car.owner_id,
        ownerProfile: {
          id: car.owner.id,
          name: car.owner.name,
          phone: car.owner.phone || '',
          email: car.owner.email,
          profilePicture: car.owner.profile_picture_url || '/profiles/default.png',
          isDealer: car.owner.is_dealer,
          location: car.owner.location || '',
          rating: car.owner.rating,
          joinDate: new Date(car.owner.join_date)
        }
      }));
    }
  }

  static async getOwnerProfile(ownerId: string): Promise<UserProfile | undefined> {
    if (AppConfig.isLocalMode || !AppConfig.server.enableRealData) {
      return undefined;
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', ownerId)
        .single();

      if (error) {
        console.error('Error fetching owner profile:', error);
        return undefined;
      }

      return {
        id: data.id,
        name: data.name,
        phone: data.phone || '',
        email: data.email,
        profilePicture: data.profile_picture_url || '/profiles/default.png',
        isDealer: data.is_dealer,
        location: data.location || '',
        rating: data.rating,
        joinDate: new Date(data.join_date)
      };
    }
  }

  static async addView(carId: string): Promise<void> {
    if (AppConfig.isLocalMode) {
      console.log(`Vue ajoutée pour le véhicule ${carId} en mode local`);
    } else {
      // Ajouter une entrée dans la table des vues
      await supabase.from('car_views').insert({
        car_id: carId,
        viewer_ip: null, // Vous pouvez obtenir l'IP côté serveur
        user_agent: navigator.userAgent
      });

      // Incrémenter le compteur de vues dans la table des voitures
      await supabase.rpc('increment_car_views', { car_uuid: carId });
    }
  }
}
```

## 6. Configuration du stockage Supabase

1. Dans votre projet Supabase, allez dans l'onglet "Storage"
2. Créez un bucket nommé "car-media"
3. Configurez les politiques pour autoriser les téléchargements/upload de photos/vidéos

## 7. Configuration du bouton de scan

Pour la fonctionnalité de scan, vous pouvez utiliser une bibliothèque comme `react-qr-scanner` :

```bash
npm install react-qr-scanner
```

Puis mettez à jour le composant ScanButton :

```tsx
// src/components/ScanButton.tsx
import { useState } from 'react';
import { QrCode, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanButton = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
  };

  const handleCloseScanner = () => {
    setIsScanning(false);
    setScanResult(null);
  };

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    // Traitez le résultat du scan ici
    console.log('QR Code scanned:', decodedText);
  };

  return (
    <>
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={handleScan}
          className="w-16 h-16 rounded-full gradient-gold text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <QrCode className="h-8 w-8" />
        </Button>
      </div>

      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Scanner un QR Code
              <Button variant="ghost" size="icon" onClick={handleCloseScanner}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {scanResult ? (
              <div className="text-center">
                <p className="mb-4">Code scanné avec succès!</p>
                <p className="text-sm break-all">{scanResult}</p>
              </div>
            ) : (
              <div id="qr-reader" className="w-full h-64 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Alignez le QR code dans le cadre</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanButton;
```

## 8. Ajout de véhicules via l'interface

Pour permettre aux utilisateurs d'ajouter des véhicules, vous pouvez créer un formulaire d'ajout :

```tsx
// src/components/AddCarForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AddCarForm = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: '',
    transmission: '',
    color: '',
    description: '',
    location: '',
    sellerType: 'DIRECT',
    sellerPhone: ''
  });

  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'mileage' || name === 'year' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // D'abord, créer le véhicule
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .insert({
          ...formData,
          price: Number(formData.price),
          mileage: Number(formData.mileage),
          year: Number(formData.year)
        })
        .select()
        .single();

      if (carError) throw carError;

      // Ensuite, télécharger les médias
      if (mediaFiles) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${carData.id}/${Date.now()}_${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('car-media')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('car-media')
            .getPublicUrl(fileName);

          // Insérer l'enregistrement du média
          await supabase
            .from('car_media')
            .insert({
              car_id: carData.id,
              url: publicUrl,
              media_type: file.type.startsWith('image/') ? 'image' : 'video',
              is_primary: i === 0
            });
        }
      }

      toast.success('Véhicule ajouté avec succès!');
      // Réinitialiser le formulaire
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        fuelType: '',
        transmission: '',
        color: '',
        description: '',
        location: '',
        sellerType: 'DIRECT',
        sellerPhone: ''
      });
    } catch (error) {
      console.error('Error adding car:', error);
      toast.error('Erreur lors de l\'ajout du véhicule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Marque</label>
          <Input 
            name="brand" 
            value={formData.brand} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Modèle</label>
          <Input 
            name="model" 
            value={formData.model} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Année</label>
          <Input 
            name="year" 
            type="number" 
            value={formData.year} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
          <Input 
            name="price" 
            type="number" 
            value={formData.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kilométrage</label>
          <Input 
            name="mileage" 
            type="number" 
            value={formData.mileage} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Carburant</label>
          <Input 
            name="fuelType" 
            value={formData.fuelType} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Transmission</label>
          <Input 
            name="transmission" 
            value={formData.transmission} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Localisation</label>
        <Input 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Téléphone du vendeur</label>
        <Input 
          name="sellerPhone" 
          value={formData.sellerPhone} 
          onChange={handleChange} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Photos/Vidéos</label>
        <Input 
          type="file" 
          multiple 
          accept="image/*,video/*" 
          onChange={handleFileChange} 
        />
      </div>

      <Button type="submit" className="w-full">Ajouter le véhicule</Button>
    </form>
  );
};

export default AddCarForm;
```

## 9. Lancement de l'application

Une fois tout configuré :

1. Installez les dépendances : `npm install`
2. Lancez l'application : `npm run dev`
3. L'application sera accessible sur `http://localhost:5173`

## 10. Fonctionnalités disponibles

- Navigation entre les véhicules en mode "TikTok"
- Accès aux profils des propriétaires
- Swipe horizontal pour accéder au profil
- Bouton de scan pour lire les QR codes
- Formulaire d'ajout de véhicules
- Système de gestion des médias
- Suivi des vues

L'application est maintenant prête à être utilisée avec Supabase pour stocker et gérer vos véhicules au nom de CARSTOK !