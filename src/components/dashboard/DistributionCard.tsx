
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DistributionCardProps {
  title: string;
  current: number;
  total: number;
  subtitle?: string;
  bgColor?: string;
}

const DistributionCard: React.FC<DistributionCardProps> = ({ 
  title, 
  current, 
  total,
  subtitle,
  bgColor = "bg-gradient-to-br from-gray-500 to-gray-600"
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  let progressColorClass = "bg-red-500";
  if (percentage > 30 && percentage < 70) {
    progressColorClass = "bg-yellow-500";
  } else if (percentage >= 70) {
    progressColorClass = "bg-green-500";
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 overflow-hidden h-full">
      <div className={cn("text-white p-4", bgColor)}>
        <CardTitle className="text-lg font-medium text-white leading-tight">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-white text-opacity-90 mt-1">{subtitle}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold">{current}/{total}</span>
          <span className="text-lg font-medium bg-white bg-opacity-20 px-2 py-1 rounded">{percentage}%</span>
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={cn("h-3 rounded-full transition-all duration-500", progressColorClass)}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Terkirim: {current}</span>
            <span>Sisa: {total - current}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionCard;
