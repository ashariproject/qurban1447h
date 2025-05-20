
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  description?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  current, 
  total,
  description
}) => {
  const percentage = Math.round((current / total) * 100);
  
  let progressColorClass = "bg-red-500";
  if (percentage > 30 && percentage < 70) {
    progressColorClass = "bg-yellow-500";
  } else if (percentage >= 70) {
    progressColorClass = "bg-qurban-500";
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{description || `${current} dari ${total}`}</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={cn("progress-bar-fill", progressColorClass)}
              style={{ width: `${percentage}%`, '--progress-width': `${percentage}%` } as React.CSSProperties}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
