
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQurban } from '@/contexts/QurbanContext';
import { Beef, Scale, Calculator, Table as TableIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AnimalWeightEntry: React.FC = () => {
  const { hewanList, updateHewanMeasurements } = useQurban();
  const [selectedHewanId, setSelectedHewanId] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

  const handleUpdate = () => {
    if (selectedHewanId && weight) {
      updateHewanMeasurements(selectedHewanId, { bobot: parseFloat(weight) });
      setWeight('');
      setSelectedHewanId('');
    }
  };

  const sortedHewan = [...hewanList].sort((a, b) => {
    if (a.jenis !== b.jenis) return a.jenis === 'sapi' ? -1 : 1;
    return a.kode.localeCompare(b.kode);
  });

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Entry Bobot & Kalkulasi Daging
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="hewan-select" className="text-xs font-bold text-gray-500 uppercase">Pilih Hewan</Label>
              <select
                id="hewan-select"
                className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedHewanId}
                onChange={(e) => setSelectedHewanId(e.target.value)}
              >
                <option value="">-- Pilih Nomor Hewan --</option>
                <optgroup label="Sapi">
                  {hewanList.filter(h => h.jenis === 'sapi').map(h => (
                    <option key={h.id} value={h.id}>{h.kode} - {h.shohibulId.startsWith('GROUP') ? 'Sapi Patungan' : 'Sapi Mandiri'}</option>
                  ))}
                </optgroup>
                <optgroup label="Kambing">
                  {hewanList.filter(h => h.jenis === 'kambing').map(h => (
                    <option key={h.id} value={h.id}>{h.kode}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight-input" className="text-xs font-bold text-gray-500 uppercase">Bobot Hidup (Kg)</Label>
              <div className="relative">
                <Input
                  id="weight-input"
                  type="number"
                  placeholder="0.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="pl-9 h-10 font-bold"
                />
                <Scale className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Button 
              onClick={handleUpdate} 
              disabled={!selectedHewanId || !weight}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10"
            >
              Simpan & Hitung
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-[10px] text-blue-700 font-medium">
              * Estimasi Daging Murni: <strong>Sapi (35%)</strong>, <strong>Kambing (40%)</strong> dari bobot hidup.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gray-50 border-b">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <TableIcon className="h-4 w-4" />
            Rekapitulasi Berat Daging
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Kode Hewan</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Bobot Hidup</TableHead>
                  <TableHead className="text-right text-blue-600 font-bold">Daging Murni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHewan.filter(h => h.bobot).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400 italic text-sm">
                      Belum ada data bobot yang dimasukkan.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedHewan.filter(h => h.bobot).map((h, idx) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-center text-xs text-gray-500">{idx + 1}</TableCell>
                      <TableCell className="font-bold">{h.kode}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={h.jenis === 'sapi' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}>
                          {h.jenis.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{h.bobot} kg</TableCell>
                      <TableCell className="text-right font-black text-blue-700">{h.beratDaging} kg</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {sortedHewan.filter(h => h.bobot).length > 0 && (
                <tfoot className="bg-blue-50/30">
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-bold py-3">TOTAL ESTIMASI DAGING:</TableCell>
                    <TableCell className="text-right font-black text-blue-800 text-lg py-3">
                      {Math.round(sortedHewan.reduce((acc, curr) => acc + (curr.beratDaging || 0), 0) * 10) / 10} kg
                    </TableCell>
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalWeightEntry;
