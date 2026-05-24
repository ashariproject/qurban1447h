import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useQurban, HewanData } from "@/contexts/QurbanContext";
import { Camera, Trash2, Eye, Plus, CheckCircle2, Beef, Image as ImageIcon, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale } from "lucide-react";

const AnimalDataForm = () => {
  const { shohibulList, hewanList, updateHewanStatus, addFotoToHewan, removeFotoFromHewan, updateHewanMeasurements } = useQurban();
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const [processAction, setProcessAction] = useState<HewanData['status']>('disembelih');
  const [bobotInput, setBobotInput] = useState<string>('');
  const [ldInput, setLdInput] = useState<string>('');

  const updateStatus = (id: string, status: HewanData['status']) => {
    updateHewanStatus(id, status);
  };

  const handlePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          addFotoToHewan(id, reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleProcessAnimal = () => {
    if (selectedAnimal) {
      updateStatus(selectedAnimal, processAction);
      
      const b = parseFloat(bobotInput);
      const ld = parseFloat(ldInput);
      if (b > 0 || ld > 0) {
        updateHewanMeasurements(selectedAnimal, { bobot: b > 0 ? b : undefined, lingkarDada: ld > 0 ? ld : undefined });
      }
      
      setSelectedAnimal('');
      setBobotInput('');
      setLdInput('');
    }
  };

  useEffect(() => {
    if (selectedAnimal) {
      const animal = hewanList.find(h => h.id === selectedAnimal);
      if (animal) {
        setBobotInput(animal.bobot?.toString() || '');
        setLdInput(animal.lingkarDada?.toString() || '');
        setProcessAction(animal.status);
      }
    }
  }, [selectedAnimal, hewanList]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sapi Card */}
        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg font-bold text-orange-600 flex items-center justify-center gap-2">
              <Beef className="h-5 w-5" />
              HEWAN SAPI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{hewanList.filter(h => h.jenis === 'sapi').length}</div>
              <div className="text-orange-100 text-xs uppercase font-bold tracking-wider">Total Hewan Sapi</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 p-2 rounded border">
                <div className="text-xl font-bold text-gray-700">{hewanList.filter(h => h.jenis === 'sapi' && h.status === 'diterima').length}</div>
                <div className="text-[10px] text-gray-500 font-bold">DITERIMA</div>
              </div>
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <div className="text-xl font-bold text-green-600">{hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima').length}</div>
                <div className="text-[10px] text-green-600 font-bold">DIPROSES</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kambing Card */}
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg font-bold text-green-600 flex items-center justify-center gap-2">
              <Beef className="h-5 w-5" />
              HEWAN KAMBING
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{hewanList.filter(h => h.jenis === 'kambing').length}</div>
              <div className="text-green-100 text-xs uppercase font-bold tracking-wider">Total Hewan Kambing</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 p-2 rounded border">
                <div className="text-xl font-bold text-gray-700">{hewanList.filter(h => h.jenis === 'kambing' && h.status === 'diterima').length}</div>
                <div className="text-[10px] text-gray-500 font-bold">DITERIMA</div>
              </div>
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <div className="text-xl font-bold text-green-600">{hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima').length}</div>
                <div className="text-[10px] text-green-600 font-bold">DIPROSES</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animal Processing List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Daftar Hewan untuk Diproses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Animal Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Pilih Hewan:</h3>
              <RadioGroup value={selectedAnimal} onValueChange={setSelectedAnimal}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-2 px-2">Hewan</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-right py-2 px-2">Berat (kg)</th>
                        <th className="text-right py-2 px-2">Berat (kg)</th>
                        <th className="text-center py-2 px-2">Foto & QR</th>
                        <th className="text-left py-2 px-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hewanList.map((animal) => {
                        const shohibul = shohibulList.find((s) => s.id === animal.shohibulId) || shohibulList[0];
                        const qrUrl = `${window.location.origin}/animal/${animal.id}`;
                        return (
                          <tr key={animal.id} className="border-b">
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={animal.id} id={animal.id} />
                                <Label htmlFor={animal.id} className="cursor-pointer">
                                  <span className="font-medium text-xs">{animal.kode}</span>
                                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${
                                    animal.jenis === 'sapi' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                  }`}>
                                    {animal.jenis.toUpperCase()}
                                  </span>
                                </Label>
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <Badge variant="outline" className="text-[9px] uppercase px-1 h-4">
                                {animal.status}
                              </Badge>
                            </td>
                            <td className="py-2 px-2 text-right font-bold text-xs">
                              {animal.bobot ? `${Math.round(animal.bobot)}` : '-'}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {animal.fotoUrls && animal.fotoUrls.length > 0 ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div className="relative cursor-pointer group rounded overflow-hidden h-10 w-10 border border-gray-200">
                                        <img src={animal.fotoUrls[0]} alt="Thumbnail" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                          <Eye className="h-4 w-4 text-white" />
                                        </div>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Foto Hewan - {animal.kode}</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid grid-cols-2 gap-2 mt-4">
                                        {animal.fotoUrls.map((url, i) => (
                                          <div key={i} className="relative group">
                                            <img src={url} alt="Hewan" className="w-full h-32 object-cover rounded shadow-sm" />
                                            <Button 
                                              variant="destructive" 
                                              size="icon" 
                                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                              onClick={() => removeFotoFromHewan(animal.id, i)}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      <div className="mt-4">
                                        <Label htmlFor={`photo-add-${animal.id}`} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100 font-semibold border border-blue-200">
                                          <Camera className="h-5 w-5" />
                                          Tambah Foto Lagi
                                        </Label>
                                        <input 
                                          id={`photo-add-${animal.id}`} 
                                          type="file" 
                                          accept="image/*" 
                                          capture="environment"
                                          className="hidden" 
                                          onChange={(e) => handlePhotoUpload(animal.id, e)}
                                        />
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  <Label htmlFor={`photo-${animal.id}`} className="cursor-pointer">
                                    <div className="relative group h-10 w-10 rounded overflow-hidden border border-gray-200 shadow-sm">
                                      <img 
                                        src={animal.jenis === 'sapi' 
                                          ? "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=150" 
                                          : "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=150"
                                        } 
                                        alt={`Dummy ${animal.jenis}`} 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" 
                                      />
                                      <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                        <Camera className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                    <input 
                                      id={`photo-${animal.id}`} 
                                      type="file" 
                                      accept="image/*" 
                                      capture="environment"
                                      className="hidden" 
                                      onChange={(e) => handlePhotoUpload(animal.id, e)}
                                    />
                                  </Label>
                                )}
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <div className="cursor-pointer h-10 w-10 rounded bg-gray-50 border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors shadow-sm" title="Tampilkan QR Code">
                                      <QrCode className="h-5 w-5" />
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[300px]">
                                    <DialogHeader>
                                      <DialogTitle className="text-center">QR Hewan - {animal.kode}</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border mt-4">
                                      <QRCodeSVG value={qrUrl} size={200} />
                                    </div>
                                    <p className="text-sm text-center text-gray-500 mt-2">Scan untuk detail hewan</p>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => {
                                 const w = window.open('', '_blank', 'width=800,height=600');
                                 if (w) {
                                   const owners = shohibulList.filter(s => s.jenisQurban === 'sapi-patungan').map(s => s.nama).join(', ');
                                   w.document.write(`
                                     <html><head><title>ID Hewan</title></head><body style='font-family:sans-serif;padding:20px;'>
                                       <h2 style='margin-bottom:10px;'>${animal.jenis === 'sapi' ? 'Sapi' : 'Kambing'} - ${animal.kode}</h2>
                                       <p><strong>Nama Kegiatan:</strong> QurbanKu - Masjid As Sakinah</p>
                                       <p><strong>Nama Shohibul:</strong> ${shohibul ? shohibul.nama : 'Hamba Allah'}</p>
                                       <p><strong>Alamat:</strong> ${shohibul ? shohibul.alamat : '-'}</p>
                                       <p><strong>Daftar 7 Orang (Patungan):</strong> ${owners}</p>
                                       <div style='margin-top:20px;' id='qr'></div>
                                       <script src='https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js'></script>
                                       <script src='https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js'></script>
                                       <script src='https://cdn.jsdelivr.net/npm/qrcode.react@3.1.0/lib/index.min.js'></script>
                                       <script>
                                         document.getElementById('qr').innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}" alt="QR Code" />';
                                       </script>
                                     </body></html>`);
                                   w.document.close();
                                   setTimeout(() => w.print(), 1000);
                                 }
                                }}>Cetak</Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </RadioGroup>
            </div>

            {/* Process Action & Measurements */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2 uppercase tracking-wider">
                <Scale className="h-4 w-4 text-blue-600" />
                INPUT BERAT & STATUS:
              </h3>

              {selectedAnimal && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-1">
                    <Label htmlFor="bobot" className="text-[10px] font-bold text-gray-500 uppercase">Berat Hidup (kg)</Label>
                    <Input 
                      id="bobot" 
                      type="number" 
                      placeholder="kg" 
                      value={bobotInput} 
                      onChange={(e) => setBobotInput(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {hewanList.find(h => h.id === selectedAnimal)?.jenis === 'sapi' && (
                    <div className="space-y-1">
                      <Label htmlFor="ld" className="text-[10px] font-bold text-gray-500 uppercase">Lingkar Dada (cm)</Label>
                      <Input 
                        id="ld" 
                        type="number" 
                        placeholder="cm" 
                        value={ldInput} 
                        onChange={(e) => setLdInput(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              <RadioGroup value={processAction} onValueChange={(value: any) => setProcessAction(value)} className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-2 rounded bg-white border border-gray-200 transition-colors cursor-pointer">
                  <RadioGroupItem value="disembelih" id="disembelih" />
                  <Label htmlFor="disembelih" className="text-xs font-bold cursor-pointer">SEMBELIH</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded bg-white border border-gray-200 transition-colors cursor-pointer">
                  <RadioGroupItem value="dipotong" id="dipotong" />
                  <Label htmlFor="dipotong" className="text-xs font-bold cursor-pointer">KULITI/POTONG</Label>
                </div>
              </RadioGroup>

              {selectedAnimal && (
                 <div className="bg-blue-600/10 p-2 rounded flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">Estimasi Daging:</span>
                    <span className="text-sm font-black text-blue-700">
                      {(() => {
                        const h = hewanList.find(it => it.id === selectedAnimal);
                        if (!h) return '0 kg';
                        let b = parseFloat(bobotInput) || 0;
                        if (b === 0 && h.jenis === 'sapi') {
                          const ld = parseFloat(ldInput) || 0;
                          if (ld > 0) b = Math.pow(ld + 22, 2) / 100;
                        }
                        const ratio = h.jenis === 'sapi' ? 0.375 : 0.356;
                        return `${Math.round(b * ratio)} kg`;
                      })()}
                    </span>
                 </div>
              )}

              <Button 
                onClick={handleProcessAnimal}
                disabled={!selectedAnimal}
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-100"
              >
                SIMPAN DATA PROSES
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalDataForm;
