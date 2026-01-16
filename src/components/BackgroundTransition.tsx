import { useEffect, useState } from 'react';

interface BackgroundTransitionProps {
  feedType: 'sales' | 'rental';
}

const BackgroundTransition = ({ feedType }: BackgroundTransitionProps) => {
  const [currentTheme, setCurrentTheme] = useState<'sales' | 'rental'>('sales');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (feedType !== currentTheme) {
      setIsChanging(true);
      const timer = setTimeout(() => {
        setCurrentTheme(feedType);
        setIsChanging(false);
      }, 300); // Durée de l'animation

      return () => clearTimeout(timer);
    }
  }, [feedType, currentTheme]);

  return (
    <div 
      className={`fixed inset-0 transition-opacity duration-300 ${
        isChanging ? 'opacity-100' : 'opacity-0'
      } pointer-events-none z-0`}
      style={{
        background: feedType === 'rental' 
          ? 'linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(200,0,0,0.05) 100%)' 
          : 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(200,80,80,0.05) 100%)',
      }}
    />
  );
};

export default BackgroundTransition;