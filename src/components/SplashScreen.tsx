import { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      onFinish();
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="flex h-24 w-24 items-center justify-center rounded-xl mx-auto mb-4 animate-scale-in bg-white p-2">
          <img
            src="/images/logo.png"
            alt="CARSTOK Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="font-display text-3xl font-bold text-white animate-slide-up">
          CARSTOK
        </h1>
        <p className="text-muted-foreground mt-2 animate-slide-up">
          by Elyndra Tech
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;