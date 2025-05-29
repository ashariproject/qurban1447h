
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
    <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 overflow-hidden">
      <div className={cn("text-white p-4", bgColor)}>
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6" />}
          {title}
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold">{current}/{total}</span>
          <span className="text-lg font-medium bg-white bg-opacity-20 px-2 py-1 rounded">{percentage}%</span>
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <div className="space-y-3">
          <Progress value={percentage} className="h-3" />
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
