
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
    <Card className="shadow-md hover:shadow-lg transition-shadow border-0 overflow-hidden">
      <div className={cn("text-white p-2", bgColor)}>
        <CardTitle className="text-xs font-medium text-white leading-tight">{title}</CardTitle>
        {subtitle && (
          <p className="text-xs text-white text-opacity-90 mt-0.5">{subtitle}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold">{current}/{total}</span>
          <span className="text-xs font-medium bg-white bg-opacity-20 px-1 py-0.5 rounded">{percentage}%</span>
        </div>
      </div>
      <CardContent className="p-2 bg-white">
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full transition-all duration-500", progressColorClass)}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Terkirim: {current}</span>
            <span>Sisa: {total - current}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionCard;
