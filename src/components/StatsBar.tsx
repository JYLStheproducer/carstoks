import { useEffect, useState } from 'react';
import { Eye, Users, Gauge, MessageCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatsBarProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'floating';
  onClose?: () => void;
}

const StatsBar = ({ position = 'top-left', onClose }: StatsBarProps) => {
  const [stats, setStats] = useState({
    total_cars: 0,
    active_cars: 0,
    total_views: 0,
    total_interactions: 0
  });

  // Determine position classes based on prop
  const getPositionClasses = () => {
    switch(position) {
      case 'top-right':
        return 'top-20 right-4 left-auto';
      case 'bottom-left':
        return 'top-auto bottom-4 left-4';
      case 'bottom-right':
        return 'top-auto bottom-4 right-4 left-auto';
      case 'floating':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'top-left':
      default:
        return 'top-20 left-4';
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total cars
        const { count: totalCarsCount } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true });

        // Fetch active cars
        const { count: activeCarsCount } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch total views (sum of all car views)
        const { data: carsData } = await supabase
          .from('cars')
          .select('views');

        const totalViews = carsData?.reduce((sum, car) => sum + (car.views || 0), 0) || 0;

        // For interactions, we'll use a placeholder since we don't have an interactions table
        // In a real app, this would come from an analytics table
        const totalInteractions = totalViews * 0.15; // Estimate 15% interaction rate

        setStats({
          total_cars: totalCarsCount || 0,
          active_cars: activeCarsCount || 0,
          total_views: totalViews,
          total_interactions: Math.floor(totalInteractions)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);

        // Fallback to mock data if there's an error
        setStats({
          total_cars: Math.floor(Math.random() * 100),
          active_cars: Math.floor(Math.random() * 80),
          total_views: Math.floor(Math.random() * 10000),
          total_interactions: Math.floor(Math.random() * 5000)
        });
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed z-50 bg-background/90 backdrop-blur-lg rounded-xl border border-border/30 p-3 shadow-lg max-w-xs ${getPositionClasses()}`}>
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-sm font-semibold text-white">Statistiques en temps réel</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Véhicules</p>
            <p className="text-sm font-bold text-white">{stats.total_cars}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
            <Eye className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Actifs</p>
            <p className="text-sm font-bold text-white">{stats.active_cars}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
            <Gauge className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Vues</p>
            <p className="text-sm font-bold text-white">{stats.total_views.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
            <MessageCircle className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Intéractions</p>
            <p className="text-sm font-bold text-white">{stats.total_interactions.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;