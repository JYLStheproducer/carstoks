import { useState } from 'react';
import { Camera, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScanButton = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Ici, vous pouvez intégrer une bibliothèque de scan QR code
    // comme react-qr-reader ou instascan
    console.log("Début du scan...");
    
    // Simulation d'un scan
    setTimeout(() => {
      setIsScanning(false);
      alert("Scan terminé - fonctionnalité à implémenter avec Supabase");
    }, 2000);
  };

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={handleScan}
        disabled={isScanning}
        className="w-16 h-16 rounded-full gradient-gold text-primary-foreground shadow-lg flex items-center justify-center"
      >
        {isScanning ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <QrCode className="h-8 w-8" />
        )}
      </Button>
    </div>
  );
};

export default ScanButton;