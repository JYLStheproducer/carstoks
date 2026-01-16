import { useState, useRef, useEffect } from 'react';
import { X, Camera, Zap, Car, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatPrice } from '@/data/mockCars';

interface ElyndraScanProps {
  onClose: () => void;
}

interface ScanResult {
  detected: boolean;
  brand?: string;
  model?: string;
  confidence?: number;
  matchingCars?: any[];
  estimatedPrice?: number;
}

const ElyndraScan = ({ onClose }: ElyndraScanProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const performScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const imageData = captureFrame();
      if (!imageData) {
        throw new Error('Impossible de capturer l\'image');
      }

      // Simulate AI car detection (in production, this would call a real AI API)
      // For demo, we'll randomly detect popular car brands
      await new Promise(resolve => setTimeout(resolve, 2000));

      const carBrands = [
        { brand: 'Toyota', model: 'Land Cruiser', priceRange: [15000000, 45000000] },
        { brand: 'Mercedes', model: 'Classe E', priceRange: [20000000, 55000000] },
        { brand: 'BMW', model: 'X5', priceRange: [25000000, 60000000] },
        { brand: 'Range Rover', model: 'Sport', priceRange: [35000000, 80000000] },
        { brand: 'Toyota', model: 'Hilux', priceRange: [12000000, 30000000] },
        { brand: 'Lexus', model: 'LX 570', priceRange: [40000000, 75000000] },
      ];

      const detected = Math.random() > 0.3; // 70% chance of detection

      if (detected) {
        const randomCar = carBrands[Math.floor(Math.random() * carBrands.length)];
        const estimatedPrice = Math.floor(
          randomCar.priceRange[0] + Math.random() * (randomCar.priceRange[1] - randomCar.priceRange[0])
        );

        // Search for matching cars in database
        const { data: matchingCars } = await supabase
          .from('cars')
          .select('*, car_media(*)')
          .ilike('brand', `%${randomCar.brand}%`)
          .eq('is_active', true)
          .limit(3);

        setScanResult({
          detected: true,
          brand: randomCar.brand,
          model: randomCar.model,
          confidence: Math.floor(Math.random() * 20) + 80,
          matchingCars: matchingCars || [],
          estimatedPrice,
        });

        toast.success('Véhicule détecté!');
      } else {
        setScanResult({
          detected: false,
        });
        toast.info('Aucun véhicule détecté. Essayez de rapprocher la caméra.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Erreur lors du scan');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 safe-top">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full gradient-gold flex-shrink-0">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-white truncate">Scan Elyndra</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 flex-shrink-0 ml-2"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative h-full w-full">
        {cameraError ? (
          <div className="flex h-full items-center justify-center px-8">
            <div className="text-center">
              <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-white mb-4">{cameraError}</p>
              <Button onClick={startCamera} variant="outline">
                Réessayer
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`relative w-72 h-48 border-2 rounded-xl ${
                isScanning ? 'border-primary animate-pulse' : 'border-white/50'
              }`}>
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            {!scanResult && !isScanning && (
              <div className="absolute bottom-32 left-0 right-0 text-center px-8">
                <p className="text-white text-sm">
                  Pointez la caméra vers un véhicule pour obtenir son estimation
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="absolute bottom-24 left-4 right-4 glass-dark rounded-2xl p-4 animate-slide-up">
          {scanResult.detected ? (
            <>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {scanResult.brand} {scanResult.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Confiance: {scanResult.confidence}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Prix estimé</p>
                  <p className="font-display font-bold text-primary">
                    {formatPrice(scanResult.estimatedPrice || 0)}
                  </p>
                </div>
              </div>

              {scanResult.matchingCars && scanResult.matchingCars.length > 0 && (
                <div className="border-t border-border/30 pt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    {scanResult.matchingCars.length} véhicule(s) similaire(s) en stock
                  </p>
                  <div className="flex gap-2 overflow-x-auto">
                    {scanResult.matchingCars.map((car: any) => (
                      <div key={car.id} className="flex-shrink-0 w-20">
                        <div className="aspect-square rounded-lg bg-card overflow-hidden">
                          {car.car_media?.[0] ? (
                            <img
                              src={car.car_media[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-white mt-1 truncate">{formatPrice(car.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setScanResult(null)}
                >
                  Nouveau scan
                </Button>
                <Button className="flex-1 gradient-gold text-primary-foreground">
                  Voir les offres
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-white">Aucun véhicule détecté</p>
              <p className="text-sm text-muted-foreground mt-1">
                Assurez-vous que le véhicule est bien visible
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setScanResult(null)}
              >
                Réessayer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Scan Button */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center safe-bottom">
        <Button
          onClick={performScan}
          disabled={isScanning || !!cameraError}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full gradient-gold shadow-lg"
        >
          {isScanning ? (
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground animate-spin" />
          ) : (
            <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ElyndraScan;
