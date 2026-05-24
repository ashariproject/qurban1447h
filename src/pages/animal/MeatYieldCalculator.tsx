import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, Info, Beef, Table as TableIcon, Calculator } from 'lucide-react';
import { useQurban } from '@/contexts/QurbanContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MeatYieldCalculator = () => {
  const { hewanList } = useQurban();
  const [animalType, setAnimalType] = useState<'sapi' | 'kambing'>('sapi');
  const [girth, setGirth] = useState(''); // cm
  const [liveWeightInput, setLiveWeightInput] = useState(''); // kg
  const [result, setResult] = useState<{ live: number; carcass: number; meat: number } | null>(null);

  const handleCalculate = () => {
    const ld = parseFloat(girth);
    const lw = parseFloat(liveWeightInput);
    
    let live = 0;
    if (lw > 0) {
      live = lw;
    } else if (animalType === 'sapi' && ld > 0) {
      // Formula BB = ((LD + 22)^2) / 100
      live = Math.pow(ld + 22, 2) / 100;
    }

    if (live <= 0) {
      setResult(null);
      return;
    }

    let carcass = 0;
    let meat = 0;

    if (animalType === 'sapi') {
      carcass = live * 0.525; // 50-55%
      meat = carcass * 0.725; // 70-75%
    } else {
      carcass = live * 0.475; // 45-50%
      meat = carcass * 0.75;  // 75%
    }

    setResult({ 
      live: Math.round(live * 10) / 10, 
      carcass: Math.round(carcass * 10) / 10,
      meat: Math.round(meat * 10) / 10 
  };

  const { updateHewanMeasurements } = useQurban();

  const handleBobotChange = (id: string, newBobot: string) => {
    const bobot = parseFloat(newBobot);
    if (!isNaN(bobot) && bobot > 0) {
      updateHewanMeasurements(id, { bobot });
    }
  };

  const totalLiveWeight = hewanList.reduce((acc, h) => acc + (h.bobot || 0), 0);
  const totalCarcass = hewanList.reduce((acc, h) => acc + (h.beratKarkas || 0), 0);
  const totalMeatSapi = hewanList.filter(h => h.jenis === 'sapi').reduce((acc, h) => acc + (h.beratDaging || 0), 0);
  const totalMeatKambing = hewanList.filter(h => h.jenis === 'kambing').reduce((acc, h) => acc + (h.beratDaging || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Summary Cards */}
          <Card className="bg-blue-600 text-white border-none shadow-lg">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-[10px] font-bold uppercase">Total Berat Hidup</p>
                <h3 className="text-xl font-black">{Math.round(totalLiveWeight)} kg</h3>
              </div>
              <Scale className="opacity-20 h-8 w-8" />
            </CardContent>
          </Card>
          <Card className="bg-orange-600 text-white border-none shadow-lg">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-orange-100 text-[10px] font-bold uppercase">Total Karkas</p>
                <h3 className="text-xl font-black">{Math.round(totalCarcass)} kg</h3>
              </div>
              <Beef className="opacity-20 h-8 w-8" />
            </CardContent>
          </Card>
          <Card className="bg-emerald-600 text-white border-none shadow-lg">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-emerald-100 text-[10px] font-bold uppercase">Daging Sapi</p>
                <h3 className="text-xl font-black">{Math.round(totalMeatSapi)} kg</h3>
              </div>
              <div className="text-2xl opacity-20">🥩</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-700 text-white border-none shadow-lg">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-emerald-100 text-[10px] font-bold uppercase">Daging Kambing</p>
                <h3 className="text-xl font-black">{Math.round(totalMeatKambing)} kg</h3>
              </div>
              <div className="text-2xl opacity-20">🍖</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Card */}
          <Card className="shadow-xl border-none">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Calculator size={20} className="text-blue-600" />
                Alat Bantu Hitung
              </CardTitle>
              <CardDescription>Gunakan lingkar dada (LD) jika timbangan tidak tersedia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-sm text-blue-800">JENIS HEWAN:</span>
                <Select value={animalType} onValueChange={(v) => setAnimalType(v as any)}>
                  <SelectTrigger className="w-40 bg-white border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sapi">Sapi</SelectItem>
                    <SelectItem value="kambing">Kambing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Berat Hidup (kg)</label>
                    <Input 
                      type="number" 
                      placeholder="Input berat jika ada timbangan" 
                      value={liveWeightInput} 
                      onChange={(e) => setLiveWeightInput(e.target.value)} 
                      className="border-gray-200 focus:ring-blue-500"
                    />
                  </div>
                  {animalType === 'sapi' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lingkar Dada (cm)</label>
                      <Input 
                        type="number" 
                        placeholder="LD di belakang kaki depan" 
                        value={girth} 
                        onChange={(e) => setGirth(e.target.value)} 
                        className="border-gray-200 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-50 rounded border border-amber-100 flex gap-2 items-start">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 leading-relaxed italic">
                    {animalType === 'sapi' 
                      ? "Rumus Sapi: BB = ((LD + 22)^2) / 100. Daging bersih ~35-40% dari bobot hidup." 
                      : "Rumus Kambing: Karkas ~45-50% bobot hidup, Daging Bersih ~75% dari karkas."}
                  </p>
                </div>

                <Button onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-md">
                  HITUNG ESTIMASI SEKARANG
                </Button>
              </div>

              {result && (
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white shadow-lg animate-in fade-in zoom-in duration-300">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">Berat Hidup</p>
                      <p className="text-xl font-black">{result.live} kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">Karkas</p>
                      <p className="text-xl font-black">{result.carcass} kg</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-1">
                      <p className="text-[10px] text-blue-100 font-bold uppercase mb-1">Daging Murni</p>
                      <p className="text-xl font-black text-yellow-300">{result.meat} kg</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* List Card */}
          <Card className="shadow-xl border-none h-full">
            <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <TableIcon size={20} className="text-green-600" />
                  Rekapitulasi Berat Hewan
                </CardTitle>
                <CardDescription>Rincian berat hidup dan daging per hewan</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-100/50 sticky top-0 z-10 backdrop-blur-sm">
                    <TableRow>
                      <TableHead className="text-[10px] font-bold uppercase">KODE</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase">JENIS</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-right">HIDUP (kg)</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-right">DAGING (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hewanList.length > 0 ? (
                      hewanList.map((h) => (
                        <TableRow key={h.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="py-2 text-xs font-bold text-gray-700">{h.kode}</TableCell>
                          <TableCell className="py-2">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              h.jenis === 'sapi' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {h.jenis}
                            </span>
                          </TableCell>
                          <TableCell className="py-2 text-right font-medium text-xs">
                            <div className="flex items-center justify-end gap-1">
                              <Input 
                                type="number" 
                                className="w-20 h-7 text-xs text-right" 
                                defaultValue={h.bobot || ''}
                                placeholder="0"
                                onBlur={(e) => handleBobotChange(h.id, e.target.value)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-right font-black text-xs text-blue-600">
                            {h.beratDaging ? `${h.beratDaging} kg` : '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-400 italic">Belum ada data timbangan</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MeatYieldCalculator;
