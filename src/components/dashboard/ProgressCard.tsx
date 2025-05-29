
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  description?: string;
  bgColor?: string;
  icon?: React.ElementType;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  current, 
  total,
  description,
  bgColor = "bg-gradient-to-br from-gray-500 to-gray-600",
  icon: Icon
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-0 overflow-hidden">
      <div className={cn("text-white p-2", bgColor)}>
        <CardTitle className="text-xs font-medium text-white flex items-center gap-1">
          {Icon && <Icon className="h-3 w-3" />}
          {title}
        </CardTitle>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold">{current}/{total}</span>
          <span className="text-xs font-medium bg-white bg-opacity-20 px-1 py-0.5 rounded">{percentage}%</span>
        </div>
      </div>
      <CardContent className="p-2 bg-white">
        <div className="space-y-1">
          <Progress value={percentage} className="h-2" />
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
