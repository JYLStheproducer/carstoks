import { useState } from 'react';
import VideoFeed from '@/components/VideoFeed';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import ScanButton from '@/components/ScanButton';
import ExplorePage from '@/components/ExplorePage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('vente');

  const renderContent = () => {
    switch (activeTab) {
      case 'vente':
        return (
          <>
            <Header activeTab="vente" />
            <VideoFeed feedType="sales" />
            <ScanButton />
          </>
        );
      case 'location':
        return (
          <>
            <Header activeTab="location" />
            <VideoFeed feedType="rental" />
            <ScanButton />
          </>
        );
      case 'explore':
        return (
          <>
            <Header activeTab="explore" />
            <ExplorePage />
          </>
        );
      default:
        return (
          <>
            <Header />
            <VideoFeed />
            <ScanButton />
          </>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
