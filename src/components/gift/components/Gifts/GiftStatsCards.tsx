// src/components/Gifts/GiftStatsCards.tsx
import React from 'react';
import { MatrixCard, MatrixCardGreen } from '../../../firstcard';

interface GiftStatsCardsProps {
  stats: {
    totalGifts: number;
    totalRequests: number;
    pendingRequests: number;
    activatedGifts: number;
  };
  loading?: boolean;
}

const GiftStatsCards: React.FC<GiftStatsCardsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
      <MatrixCardGreen
        title="Total Gift Items"
        value={stats.totalGifts}
        change="Total number of gift items"
      />
      <MatrixCard
        title="Total Gift Requests"
        value={stats.totalRequests}
        change="All gift requests"
      />
      <MatrixCard
        title="Pending Requests"
        value={stats.pendingRequests}
        change="Awaiting approval"
      />
      <MatrixCard
        title="Activated Gifts"
        value={stats.activatedGifts}
        change="Currently active gifts"
      />
    </div>
  );
};

export default GiftStatsCards;