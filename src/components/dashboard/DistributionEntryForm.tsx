
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQurban } from '@/contexts/QurbanContext';
import { Truck } from 'lucide-react';

const DistributionEntryForm: React.FC = () => {
  const { distributionList, updateDistribution } = useQurban();

  // Filter only the categories requested by the user
  const editableCategories = distributionList.filter(d => 
    ['pantai-mentari', 'kompleks-al', 'warga-lain'].includes(d.id)
  );

  const handleChange = (id: string, field: 'current' | 'total', value: string) => {
    const numValue = parseInt(value) || 0;
    updateDistribution(id, { [field]: numValue });
  };

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Update Distribusi Paket
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editableCategories.map((cat) => (
            <div key={cat.id} className="space-y-3 p-3 rounded-lg border border-gray-100 bg-gray-50/30">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-2 w-2 rounded-full ${cat.bgColor.replace('bg-gradient-to-br ', '').split(' ')[0]}`} />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{cat.title}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`${cat.id}-current`} className="text-[10px] font-bold text-gray-500 uppercase">Terkirim</Label>
                  <Input
                    id={`${cat.id}-current`}
                    type="number"
                    value={cat.current}
                    onChange={(e) => handleChange(cat.id, 'current', e.target.value)}
                    className="h-8 text-sm font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${cat.id}-total`} className="text-[10px] font-bold text-gray-500 uppercase">Target (KK)</Label>
                  <Input
                    id={`${cat.id}-total`}
                    type="number"
                    value={cat.total}
                    onChange={(e) => handleChange(cat.id, 'total', e.target.value)}
                    className="h-8 text-sm font-bold bg-white"
                  />
                </div>
              </div>
              
              <div className="pt-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">Progres</span>
                  <span className="font-bold text-blue-600">{cat.total > 0 ? Math.round((cat.current / cat.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${cat.total > 0 ? Math.min(100, (cat.current / cat.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionEntryForm;
