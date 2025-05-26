
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  description?: string;
  bgColor?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  current, 
  total,
  description,
  bgColor = "bg-gradient-to-br from-gray-500 to-gray-600"
}) => {
  const percentage = Math.round((current / total) * 100);
  
  let progressColorClass = "bg-red-500";
  if (percentage > 30 && percentage < 70) {
    progressColorClass = "bg-yellow-500";
  } else if (percentage >= 70) {
    progressColorClass = "bg-green-500";
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 overflow-hidden">
      <div className={cn("text-white p-4", bgColor)}>
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold">{current}/{total}</span>
          <span className="text-lg font-medium bg-white bg-opacity-20 px-2 py-1 rounded">{percentage}%</span>
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <div className="space-y-3">
          <div className="progress-bar bg-gray-200">
            <div 
              className={cn("progress-bar-fill transition-all duration-500", progressColorClass)}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
