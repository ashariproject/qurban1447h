import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQurban } from '@/contexts/QurbanContext';
import { Package, Beef, Zap, Save } from 'lucide-react';

const PackagingEntryForm: React.FC = () => {
  const { packagingData, updatePackagingData } = useQurban();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    sapiPacksInput: 0,
    sapiPacksOutput: 0,
    kambingPacksInput: 0,
    kambingPacksOutput: 0,
  });

  React.useEffect(() => {
    if (packagingData) {
      setFormData({
        sapiPacksInput: packagingData.sapiPacksInput || 0,
        sapiPacksOutput: packagingData.sapiPacksOutput || 0,
        kambingPacksInput: packagingData.kambingPacksInput || 0,
        kambingPacksOutput: packagingData.kambingPacksOutput || 0,
      });
    }
  }, [packagingData]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePackagingData(formData);
      toast({
        title: "Data Disimpan",
        description: "Data pengemasan berhasil diperbarui ke database.",
      });
    } catch (error) {
      console.error("Error saving packaging data:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data ke database.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-4">
        <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
          <Package className="h-4 w-4" />
          Update Data Pengemasan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sapi Packaging */}
            <div className="space-y-3 p-3 rounded-xl border border-orange-100 bg-orange-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Beef className="h-3 w-3 text-orange-600" />
                <span className="text-xs font-black text-orange-700 uppercase tracking-widest">SAPI (PACK)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-gray-400 uppercase">Input (Target)</Label>
                  <Input
                    type="number"
                    value={formData.sapiPacksInput}
                    onChange={(e) => handleChange('sapiPacksInput', e.target.value)}
                    className="h-8 text-sm font-black border-orange-200 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-gray-400 uppercase">Output (Selesai)</Label>
                  <Input
                    type="number"
                    value={formData.sapiPacksOutput}
                    onChange={(e) => handleChange('sapiPacksOutput', e.target.value)}
                    className="h-8 text-sm font-black border-orange-200 focus:ring-orange-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="pt-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500 font-bold">PROGRES KEMAS</span>
                  <span className="font-black text-orange-600">
                    {formData.sapiPacksInput > 0 ? Math.round((formData.sapiPacksOutput / formData.sapiPacksInput) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-orange-200/50 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" 
                    style={{ width: `${formData.sapiPacksInput > 0 ? Math.min(100, (formData.sapiPacksOutput / formData.sapiPacksInput) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Kambing Packaging */}
            <div className="space-y-3 p-3 rounded-xl border border-purple-100 bg-purple-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-black text-purple-700 uppercase tracking-widest">KAMBING (PACK)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-gray-400 uppercase">Input (Target)</Label>
                  <Input
                    type="number"
                    value={formData.kambingPacksInput}
                    onChange={(e) => handleChange('kambingPacksInput', e.target.value)}
                    className="h-8 text-sm font-black border-purple-200 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-gray-400 uppercase">Output (Selesai)</Label>
                  <Input
                    type="number"
                    value={formData.kambingPacksOutput}
                    onChange={(e) => handleChange('kambingPacksOutput', e.target.value)}
                    className="h-8 text-sm font-black border-purple-200 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="pt-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500 font-bold">PROGRES KEMAS</span>
                  <span className="font-black text-purple-600">
                    {formData.kambingPacksInput > 0 ? Math.round((formData.kambingPacksOutput / formData.kambingPacksInput) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-purple-200/50 rounded-full h-1.5">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(147,51,234,0.4)]" 
                    style={{ width: `${formData.kambingPacksInput > 0 ? Math.min(100, (formData.kambingPacksOutput / formData.kambingPacksInput) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold hover:scale-[1.02] active:scale-95 transition-transform flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Menyimpan..." : "Simpan Data Pengemasan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PackagingEntryForm;
