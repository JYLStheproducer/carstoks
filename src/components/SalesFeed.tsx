import { useState, useRef, useEffect } from 'react';
import { mockCars } from '@/data/mockCars';
import CarTok from './CarTok';

const SalesFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < mockCars.length) {
        setActiveIndex(newIndex);
      }
    };

    const handleScrollEnd = () => {
      isScrolling.current = false;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const targetScroll = Math.round(scrollTop / itemHeight) * itemHeight;

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    };

    let scrollTimeout: NodeJS.Timeout;

    const onScroll = () => {
      handleScroll();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 100);
    };

    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-screen w-full snap-y snap-mandatory overflow-y-scroll"
    >
      {mockCars.map((car, index) => (
        <div
          key={car.id}
          className="h-screen w-full snap-start"
        >
          <CarTok car={car} isActive={index === activeIndex} />
        </div>
      ))}
    </div>
  );
};

export default SalesFeed;