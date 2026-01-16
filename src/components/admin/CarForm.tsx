import { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CarData } from './AdminDashboard';

interface CarFormProps {
  car: CarData | null;
  onClose: () => void;
}

const CarForm = ({ car, onClose }: CarFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState(car?.car_media || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    price: car?.price || 0,
    original_price: car?.original_price || 0, // Add original price field
    mileage: car?.mileage || 0,
    fuel_type: car?.fuel_type || 'Essence',
    transmission: car?.transmission || 'Automatique',
    color: car?.color || '',
    description: car?.description || '',
    location: car?.location || 'Libreville',
    seller_type: car?.seller_type || 'NO_FACE',
    seller_phone: car?.seller_phone || '',
    elyndra_score: car?.elyndra_score || Math.floor(Math.random() * 50) + 50,
    features: car?.features?.join(', ') || '', // Convert array to comma-separated string
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['year', 'price', 'original_price', 'mileage', 'elyndra_score'].includes(name)
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeNewMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (mediaId: string, url: string) => {
    try {
      // Extract file path from URL
      const path = url.split('/car-media/')[1];
      if (path) {
        await supabase.storage.from('car-media').remove([path]);
      }
      await supabase.from('car_media').delete().eq('id', mediaId);
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
      toast.success('Média supprimé');
    } catch (error) {
      console.error('Error removing media:', error);
      toast.error('Erreur de suppression');
    }
  };

  const uploadMedia = async (carId: string) => {
    const uploadedUrls: { url: string; type: string }[] = [];

    for (const file of mediaFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}/${Date.now()}.${fileExt}`;
      
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

      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      uploadedUrls.push({ url: publicUrl, type: mediaType });
    }

    // Insert media records
    if (uploadedUrls.length > 0) {
      const mediaRecords = uploadedUrls.map((m, index) => ({
        car_id: carId,
        url: m.url,
        media_type: m.type,
        is_primary: index === 0 && existingMedia.length === 0,
      }));

      await supabase.from('car_media').insert(mediaRecords);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.brand.trim() || !formData.model.trim()) {
        toast.error('La marque et le modèle sont requis');
        setIsLoading(false);
        return;
      }

      if (formData.price <= 0) {
        toast.error('Le prix doit être supérieur à 0');
        setIsLoading(false);
        return;
      }

      if (formData.year < 1990 || formData.year > new Date().getFullYear() + 1) {
        toast.error(`L'année doit être entre 1990 et ${new Date().getFullYear() + 1}`);
        setIsLoading(false);
        return;
      }

      // Process features - split by comma and trim whitespace
      const featuresArray = formData.features
        ? formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
        : [];

      // Prepare car data - only include fields that exist in the database
      const carData = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: formData.year,
        price: formData.price,
        original_price: formData.original_price || null, // Include original price
        mileage: formData.mileage,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        color: formData.color.trim(),
        description: formData.description.trim(),
        location: formData.location,
        seller_type: formData.seller_type,
        seller_phone: formData.seller_type === 'DIRECT' ? formData.seller_phone.trim() : null,
        elyndra_score: formData.elyndra_score,
      };

      if (car) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', car.id);

        if (error) throw error;

        if (mediaFiles.length > 0) {
          await uploadMedia(car.id);
        }

        toast.success('Véhicule mis à jour avec succès');
      } else {
        // Create new car
        const { data, error } = await supabase
          .from('cars')
          .insert(carData)
          .select()
          .single();

        if (error) throw error;

        if (mediaFiles.length > 0 && data) {
          await uploadMedia(data.id);
        }

        toast.success('Véhicule ajouté avec succès');
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving car:', error);
      if (error.message) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error('Une erreur est survenue lors de la sauvegarde');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 glass-dark border-b border-border/30">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-display text-lg font-bold text-white">
            {car ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
        {/* Media Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Photos & Vidéos</label>
          
          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {existingMedia.map((media) => (
                <div key={media.id} className="relative aspect-square rounded-lg overflow-hidden bg-card">
                  {media.media_type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingMedia(media.id, media.url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                  {media.media_type === 'video' && (
                    <Video className="absolute bottom-1 left-1 h-4 w-4 text-white" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-card">
                  {file.type.startsWith('video/') ? (
                    <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeNewMedia(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1 rounded">
                    Nouveau
                  </span>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-dashed"
          >
            <Upload className="h-4 w-4 mr-2" />
            Ajouter des médias
          </Button>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white">Marque</label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Toyota"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white">Modèle</label>
            <Input
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Land Cruiser"
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* Year & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white">Année</label>
            <Input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              min={1990}
              max={new Date().getFullYear() + 1}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white">Prix (FCFA)</label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="15000000"
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* Original Price */}
        <div>
          <label className="text-sm font-medium text-white">Prix original (FCFA) (optionnel)</label>
          <Input
            name="original_price"
            type="number"
            value={formData.original_price}
            onChange={handleInputChange}
            placeholder="18000000"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Prix d'origine du véhicule (facultatif)
          </p>
        </div>

        {/* Mileage & Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white">Kilométrage</label>
            <Input
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleInputChange}
              placeholder="50000"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white">Couleur</label>
            <Input
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Noir"
              className="mt-1"
            />
          </div>
        </div>

        {/* Fuel & Transmission */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white">Carburant</label>
            <Select
              value={formData.fuel_type}
              onValueChange={(v) => handleSelectChange('fuel_type', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Essence">Essence</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Hybride">Hybride</SelectItem>
                <SelectItem value="Électrique">Électrique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-white">Transmission</label>
            <Select
              value={formData.transmission}
              onValueChange={(v) => handleSelectChange('transmission', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatique">Automatique</SelectItem>
                <SelectItem value="Manuelle">Manuelle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location & Seller Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white">Ville</label>
            <Select
              value={formData.location}
              onValueChange={(v) => handleSelectChange('location', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Libreville">Libreville</SelectItem>
                <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                <SelectItem value="Franceville">Franceville</SelectItem>
                <SelectItem value="Oyem">Oyem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-white">Type vendeur</label>
            <Select
              value={formData.seller_type}
              onValueChange={(v) => handleSelectChange('seller_type', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NO_FACE">NO FACE (Anonyme)</SelectItem>
                <SelectItem value="DIRECT">DIRECT (Contact)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Seller Phone (if DIRECT) */}
        {formData.seller_type === 'DIRECT' && (
          <div>
            <label className="text-sm font-medium text-white">Téléphone vendeur</label>
            <Input
              name="seller_phone"
              value={formData.seller_phone}
              onChange={handleInputChange}
              placeholder="+241 XX XX XX XX"
              className="mt-1"
            />
          </div>
        )}

        {/* Elyndra Score */}
        <div>
          <label className="text-sm font-medium text-white">Score Elyndra (0-100)</label>
          <Input
            name="elyndra_score"
            type="number"
            value={formData.elyndra_score}
            onChange={handleInputChange}
            min={0}
            max={100}
            className="mt-1"
          />
        </div>

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-white">Équipements (séparés par des virgules)</label>
          <Input
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            placeholder="Climatisation, Vitres électriques, Toit ouvrant, etc."
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Séparez les équipements par des virgules
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-white">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description du véhicule..."
            rows={4}
            className="mt-1"
          />
        </div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 right-0 p-4 glass-dark border-t border-border/30">
          <Button
            type="submit"
            className="w-full gradient-gold text-primary-foreground font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Sauvegarde...' : (car ? 'Mettre à jour' : 'Ajouter le véhicule')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
