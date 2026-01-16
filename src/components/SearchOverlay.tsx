import { useState } from 'react';
import { X, Search, Filter, MapPin, Fuel, Gauge, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  vehicles: any[];
}

const SearchOverlay = ({ isOpen, onClose, onApply, vehicles }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, new Date().getFullYear()]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 500000]);
  const [fuel, setFuel] = useState<string[]>([]);
  const [transmission, setTransmission] = useState('');
  const [location, setLocation] = useState('');
  const [transactionType, setTransactionType] = useState<'vente' | 'location' | 'both'>('both');

  if (!isOpen) return null;

  // Get unique values for dropdowns
  const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
  const locations = [...new Set(vehicles.map(vehicle => vehicle.location))];
  const fuels = ['Diesel', 'Essence', 'Électrique', 'Hybride'];
  const transmissions = ['Automatique', 'Manuelle'];

  const handleApply = () => {
    const filters = {
      searchTerm,
      brand,
      priceRange,
      yearRange,
      mileageRange,
      fuel,
      transmission,
      location,
      transactionType
    };
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setSearchTerm('');
    setBrand('');
    setPriceRange([0, 100000000]);
    setYearRange([2000, new Date().getFullYear()]);
    setMileageRange([0, 500000]);
    setFuel([]);
    setTransmission('');
    setLocation('');
    setTransactionType('both');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute bottom-0 left-0 right-0 h-5/6 bg-[#0A0A0A] rounded-t-3xl border-t border-[#2A2A2A] p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="text-[#FF0080]" size={24} />
            Recherche
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" size={20} />
          <input
            type="text"
            placeholder="Ex: Toyota Land Cruiser"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
          />
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {/* Brand Filter */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Marque</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
            >
              <option value="">Toutes les marques</option>
              {brands.map((brandName) => (
                <option key={brandName} value={brandName} className="bg-[#1A1A1A] text-white">
                  {brandName}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Prix (FCFA)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
              />
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Année</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={yearRange[0]}
                onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
              />
              <input
                type="number"
                placeholder="Max"
                value={yearRange[1]}
                onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
              />
            </div>
          </div>

          {/* Mileage Range */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Kilométrage</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={mileageRange[0]}
                onChange={(e) => setMileageRange([Number(e.target.value), mileageRange[1]])}
                className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
              />
              <input
                type="number"
                placeholder="Max"
                value={mileageRange[1]}
                onChange={(e) => setMileageRange([mileageRange[0], Number(e.target.value)])}
                className="flex-1 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Carburant</label>
            <div className="grid grid-cols-2 gap-2">
              {fuels.map((fuelType) => (
                <button
                  key={fuelType}
                  type="button"
                  onClick={() => {
                    if (fuel.includes(fuelType)) {
                      setFuel(fuel.filter(f => f !== fuelType));
                    } else {
                      setFuel([...fuel, fuelType]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-center ${
                    fuel.includes(fuelType)
                      ? 'bg-[#FF0080]/20 border-[#FF0080] text-[#FF0080]'
                      : 'bg-[#1A1A1A] border-[#2A2A2A] text-white'
                  }`}
                >
                  {fuelType}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Transmission</label>
            <div className="grid grid-cols-2 gap-2">
              {transmissions.map((trans) => (
                <button
                  key={trans}
                  type="button"
                  onClick={() => setTransmission(trans === transmission ? '' : trans)}
                  className={`p-3 rounded-xl border text-center ${
                    trans === transmission
                      ? 'bg-[#FF0080]/20 border-[#FF0080] text-[#FF0080]'
                      : 'bg-[#1A1A1A] border-[#2A2A2A] text-white'
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Localisation</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
            >
              <option value="">Toutes les localisations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc} className="bg-[#1A1A1A] text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-[#B3B3B3] mb-2">Type de transaction</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTransactionType('vente')}
                className={`p-3 rounded-xl border text-center ${
                  transactionType === 'vente'
                    ? 'bg-[#FF0080]/20 border-[#FF0080] text-[#FF0080]'
                    : 'bg-[#1A1A1A] border-[#2A2A2A] text-white'
                }`}
              >
                Vente
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('location')}
                className={`p-3 rounded-xl border text-center ${
                  transactionType === 'location'
                    ? 'bg-[#FF0080]/20 border-[#FF0080] text-[#FF0080]'
                    : 'bg-[#1A1A1A] border-[#2A2A2A] text-white'
                }`}
              >
                Location
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('both')}
                className={`p-3 rounded-xl border text-center ${
                  transactionType === 'both'
                    ? 'bg-[#FF0080]/20 border-[#FF0080] text-[#FF0080]'
                    : 'bg-[#1A1A1A] border-[#2A2A2A] text-white'
                }`}
              >
                Les deux
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#FF0080] text-[#FF0080] hover:bg-[#FF0080]/20"
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          <Button
            className="flex-1 bg-[#FF0080] hover:bg-[#E6006B]"
            onClick={handleApply}
          >
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;