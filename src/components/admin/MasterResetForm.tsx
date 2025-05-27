
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQurban } from '@/contexts/QurbanContext';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MasterResetForm: React.FC = () => {
  const { resetAllData } = useQurban();
  const { toast } = useToast();

  const handleReset = () => {
    resetAllData();
    toast({
      title: "Data Berhasil Direset",
      description: "Semua data qurban telah dikembalikan ke nilai awal.",
    });
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Master Reset Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-600">
          Reset semua data qurban ke nilai awal. Tindakan ini tidak dapat dibatalkan.
        </p>
        <Button 
          onClick={handleReset}
          variant="destructive"
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Semua Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default MasterResetForm;
