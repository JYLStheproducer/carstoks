import { useState, useEffect } from 'react';
import { LogOut, Plus, Car, Image, Trash2, Edit, Eye, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CarForm from './CarForm';
import CarList from './CarList';

interface AdminDashboardProps {
  onLogout: () => void;
}

export interface CarData {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  original_price?: number; // Optional original price
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  location: string;
  seller_type: string;
  seller_phone: string;
  views: number;
  elyndra_score: number;
  is_active: boolean;
  created_at: string;
  features?: string[]; // Array of features
  car_media?: { id: string; url: string; media_type: string; is_primary: boolean }[];
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterSellerType, setFilterSellerType] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          car_media (id, url, media_type, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to add features as an empty array if not present
      const processedData = data?.map(car => ({
        ...car,
        features: car.features || [] // Ensure features is an array
      })) || [];

      setCars(processedData);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Erreur de chargement des véhicules');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters whenever cars or filter values change
  useEffect(() => {
    let result = [...cars];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(car =>
        car.brand.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.description?.toLowerCase().includes(term) ||
        car.location?.toLowerCase().includes(term) ||
        car.color?.toLowerCase().includes(term) ||
        car.id.includes(term)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(car =>
        filterStatus === 'active' ? car.is_active : !car.is_active
      );
    }

    // Apply seller type filter
    if (filterSellerType !== 'all') {
      result = result.filter(car => car.seller_type === filterSellerType);
    }

    // Apply location filter
    if (filterLocation !== 'all') {
      result = result.filter(car => car.location === filterLocation);
    }

    setFilteredCars(result);
  }, [cars, searchTerm, filterStatus, filterSellerType, filterLocation]);

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (carId: string) => {
    if (!confirm('Supprimer ce véhicule?')) return;

    try {
      const { error } = await supabase.from('cars').delete().eq('id', carId);
      if (error) throw error;
      toast.success('Véhicule supprimé');
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Erreur de suppression');
    }
  };

  const handleToggleActive = async (carId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_active: !isActive })
        .eq('id', carId);
      if (error) throw error;
      toast.success(isActive ? 'Véhicule masqué' : 'Véhicule visible');
      fetchCars();
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Erreur de mise à jour');
    }
  };

  const handleEdit = (car: CarData) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCar(null);
    fetchCars();
  };

  // Export data as CSV
  const exportDataAsCSV = () => {
    if (filteredCars.length === 0) {
      toast.info('Aucune donnée à exporter');
      return;
    }

    // Prepare CSV content
    const headers = [
      'ID', 'Marque', 'Modèle', 'Année', 'Prix', 'Prix Original', 'Kilométrage',
      'Carburant', 'Transmission', 'Couleur', 'Description', 'Localisation',
      'Type Vendeur', 'Téléphone Vendeur', 'Vues', 'Score Elyndra', 'Actif', 'Créé le'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredCars.map(car => [
        `"${car.id}"`,
        `"${car.brand}"`,
        `"${car.model}"`,
        car.year,
        car.price,
        car.original_price || '',
        car.mileage,
        `"${car.fuel_type}"`,
        `"${car.transmission}"`,
        `"${car.color}"`,
        `"${car.description?.replace(/"/g, '""') || ''}"`,
        `"${car.location}"`,
        `"${car.seller_type}"`,
        `"${car.seller_phone}"`,
        car.views,
        car.elyndra_score,
        car.is_active ? 'Oui' : 'Non',
        `"${new Date(car.created_at).toLocaleDateString()}"`,
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `carstok-vehicles-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Données exportées avec succès');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-border/30">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-display text-xl font-bold text-white">
              CARSTOK <span className="text-primary">Admin</span>
            </h1>
            <p className="text-xs text-muted-foreground">Gestion du catalogue</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportDataAsCSV}
              className="text-muted-foreground hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="glass-dark rounded-xl p-4 text-center">
          <Car className="mx-auto h-6 w-6 text-primary mb-2" />
          <p className="text-2xl font-bold text-white">{cars.length}</p>
          <p className="text-xs text-muted-foreground">Véhicules</p>
        </div>
        <div className="glass-dark rounded-xl p-4 text-center">
          <Eye className="mx-auto h-6 w-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-white">
            {cars.filter(c => c.is_active).length}
          </p>
          <p className="text-xs text-muted-foreground">Actifs</p>
        </div>
        <div className="glass-dark rounded-xl p-4 text-center">
          <Image className="mx-auto h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-white">
            {cars.reduce((acc, car) => acc + (car.car_media?.length || 0), 0)}
          </p>
          <p className="text-xs text-muted-foreground">Médias</p>
        </div>
        <div className="glass-dark rounded-xl p-4 text-center">
          <Eye className="mx-auto h-6 w-6 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-white">
            {cars.reduce((acc, car) => acc + (car.views || 0), 0)}
          </p>
          <p className="text-xs text-muted-foreground">Vues totales</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 mb-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par marque, modèle, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="gradient-gold text-primary-foreground font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSellerType} onValueChange={setFilterSellerType}>
            <SelectTrigger>
              <SelectValue placeholder="Type de vendeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="DIRECT">Direct</SelectItem>
              <SelectItem value="NO_FACE">Anonyme</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem value="Libreville">Libreville</SelectItem>
              <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
              <SelectItem value="Franceville">Franceville</SelectItem>
              <SelectItem value="Oyem">Oyem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Car List */}
      <CarList
        cars={filteredCars}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Car Form Modal */}
      {showForm && (
        <CarForm
          car={editingCar}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
