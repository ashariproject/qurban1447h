import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useQurban, HewanData } from "@/contexts/QurbanContext";
import { Camera, Trash2, Beef, Image as ImageIcon, QrCode, Video, Edit, Printer, Scale } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { compressImage } from "@/utils/imageCompressor";

const AnimalDataForm = () => {
  const { shohibulList, hewanList, updateHewanStatus, addFotoToHewan, removeFotoFromHewan, updateHewanMeasurements } = useQurban();
  const [editingAnimal, setEditingAnimal] = useState<HewanData | null>(null);
  const [qrAnimal, setQrAnimal] = useState<HewanData | null>(null);

  // Form states for editing modal
  const [editStatus, setEditStatus] = useState<HewanData['status']>('daftar');
  const [editBobot, setEditBobot] = useState<string>('');
  const [editLd, setEditLd] = useState<string>('');

  const getAnimalLabel = (animal: HewanData) => {
    if (animal.jenis === 'kambing') {
      const shohibul = shohibulList.find(s => s.id === animal.shohibulId);
      const category = shohibul?.jenisQurban === 'kambing-titip-beli' ? 'Kambing Titip' : 'Kambing Mandiri';
      return `${category} - ${shohibul?.nama || 'Hamba Allah'}`;
    } else {
      // Sapi
      if (animal.kode === 'S-01') return 'SAPI PATUNGAN 1';
      if (animal.kode === 'S-02') return 'SAPI PATUNGAN 2';
      if (animal.kode === 'S-03') return 'SAPI PATUNGAN 3';
      if (animal.kode === 'S-04') return 'SAPI PATUNGAN 4';
      if (animal.kode === 'S-05') return 'SAPI PATUNGAN 5';
      
      const shohibul = shohibulList.find(s => s.id === animal.shohibulId);
      if (animal.kode === 'S-06') {
        return `SAPI TITIP BELI - ${shohibul?.nama || 'Heryuda'}`;
      }
      return `SAPI MANDIRI - ${shohibul?.nama || 'Shohibul'}`;
    }
  };

  const getPatunganNames = (code: string) => {
    const match = code.match(/S-0(\d)/);
    if (!match) return [];
    const groupIndex = parseInt(match[1]) - 1;
    if (isNaN(groupIndex) || groupIndex < 0 || groupIndex >= 5) return [];
    
    const patunganList = shohibulList
      .filter(s => s.jenisQurban === 'sapi-patungan')
      .sort((a, b) => (a.tanggalDaftar || '').localeCompare(b.tanggalDaftar || ''));
    
    const group = patunganList.slice(groupIndex * 7, (groupIndex + 1) * 7);
    return group.map(s => s.nama);
  };

  const handleEditClick = (animal: HewanData) => {
    setEditingAnimal(animal);
    setEditStatus(animal.status);
    setEditBobot(animal.bobot?.toString() || '');
    setEditLd(animal.lingkarDada?.toString() || '');
  };

  const handleSaveEdit = async () => {
    if (editingAnimal) {
      if (editStatus !== editingAnimal.status) {
        await updateHewanStatus(editingAnimal.id, editStatus);
      }

      const b = parseFloat(editBobot);
      const ld = parseFloat(editLd);
      await updateHewanMeasurements(editingAnimal.id, {
        bobot: !isNaN(b) ? b : undefined,
        lingkarDada: !isNaN(ld) ? ld : undefined
      });

      setEditingAnimal(null);
    }
  };

  const handlePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const compressed = await compressImage(reader.result as string);
            addFotoToHewan(id, compressed);
          } catch (err) {
            console.error("Compression failed, uploading original image", err);
            addFotoToHewan(id, reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const getStatusBadge = (status: HewanData['status']) => {
    switch (status) {
      case 'daftar':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">DAFTAR</Badge>;
      case 'diterima':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-800 border-yellow-200">DITERIMA</Badge>;
      case 'disembelih':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">DISEMBELIH</Badge>;
      case 'dipotong':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none">POTONG/KULITI</Badge>;
      case 'distribusi':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white border-none">DISTRIBUSI</Badge>;
      default:
        return <Badge variant="outline">{status?.toUpperCase() || 'DAFTAR'}</Badge>;
    }
  };

  // Sort: Sapi first, then Kambing, each sorted by their code
  const sortedHewanList = [...hewanList].sort((a, b) => {
    if (a.jenis !== b.jenis) {
      return a.jenis === 'sapi' ? -1 : 1;
    }
    return a.kode.localeCompare(b.kode);
  });

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
                <div className="text-xl font-bold text-gray-700">{hewanList.filter(h => h.jenis === 'sapi' && (h.status === 'diterima' || h.status === 'daftar' || !h.status)).length}</div>
                <div className="text-[10px] text-gray-500 font-bold">BELUM DISEMBELIH</div>
              </div>
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <div className="text-xl font-bold text-green-600">{hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima' && h.status !== 'daftar' && h.status).length}</div>
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
                <div className="text-xl font-bold text-gray-700">{hewanList.filter(h => h.jenis === 'kambing' && (h.status === 'diterima' || h.status === 'daftar' || !h.status)).length}</div>
                <div className="text-[10px] text-gray-500 font-bold">BELUM DISEMBELIH</div>
              </div>
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <div className="text-xl font-bold text-green-600">{hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima' && h.status !== 'daftar' && h.status).length}</div>
                <div className="text-[10px] text-green-600 font-bold">DIPROSES</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thumbnail Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Status & Dokumentasi Hewan</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedHewanList.map((animal) => {
            const label = getAnimalLabel(animal);
            const hasMedia = animal.fotoUrls && animal.fotoUrls.length > 0;
            const isVideo = hasMedia && animal.fotoUrls[0].startsWith('data:video/');
            const qrUrl = `${window.location.origin}/animal/${animal.id}`;
            const isSapi = animal.jenis === 'sapi';
            
            // Dummy images based on animal type
            const dummyImage = isSapi ? "/images/sapi_bali_lokal.png" : "/images/kambing_lokal.png";

            return (
              <Card key={animal.id} className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col">
                {/* Thumbnail Header */}
                <div className="relative h-44 bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {hasMedia ? (
                    isVideo ? (
                      <video src={animal.fotoUrls[0]} className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <img src={animal.fotoUrls[0]} alt={label} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <img src={dummyImage} alt={`Dummy ${animal.jenis}`} className="w-full h-full object-cover opacity-40" />
                  )}
                  {/* Status Badge Over Image */}
                  <div className="absolute top-2 left-2 z-10">
                    {getStatusBadge(animal.status)}
                  </div>
                  {/* Animal Code Over Image */}
                  <div className="absolute top-2 right-2 z-10 bg-black/60 text-white font-bold text-xs px-2 py-0.5 rounded">
                    {animal.kode}
                  </div>
                </div>

                {/* Card Info Content */}
                <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight min-h-[36px] flex items-center">
                      {label}
                    </h3>
                    
                    {/* Shohibul List for Patungan Sapi */}
                    {isSapi && animal.kode.startsWith('S-0') && parseInt(animal.kode.split('-')[1]) <= 5 && (
                      <div className="mt-1.5 p-2 bg-orange-50/50 rounded border border-orange-100/50 text-[10px] text-gray-600">
                        <div className="font-bold text-[9px] text-orange-700 uppercase mb-0.5">Shohibul:</div>
                        <p className="line-clamp-2 leading-tight">
                          {getPatunganNames(animal.kode).join(', ')}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Berat Hidup:</span>
                        <span className="font-semibold">{animal.bobot ? `${Math.round(animal.bobot)} kg` : '-'}</span>
                      </div>
                      {isSapi && (
                        <div className="flex justify-between">
                          <span>Lingkar Dada:</span>
                          <span className="font-semibold">{animal.lingkarDada ? `${Math.round(animal.lingkarDada)} cm` : '-'}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-1 mt-1 text-blue-600 font-medium">
                        <span>Estimasi Daging:</span>
                        <span>{animal.beratDaging ? `${Math.round(animal.beratDaging)} kg` : '-'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Card Actions Footer */}
                <CardFooter className="p-2 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-1 text-xs font-semibold flex items-center justify-center gap-1 border-gray-200"
                    onClick={() => handleEditClick(animal)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-1 text-xs font-semibold flex items-center justify-center gap-1 border-gray-200"
                    onClick={() => setQrAnimal(animal)}
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    QR
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-1 text-xs font-semibold flex items-center justify-center gap-1 border-gray-200"
                    onClick={() => {
                      const w = window.open('', '_blank', 'width=800,height=600');
                      if (w) {
                        const owners = shohibulList.filter(s => s.jenisQurban === 'sapi-patungan').map(s => s.nama).join(', ');
                        w.document.write(`
                          <html><head><title>ID Hewan</title></head><body style='font-family:sans-serif;padding:20px;'>
                            <h2 style='margin-bottom:10px;'>${animal.jenis === 'sapi' ? 'Sapi' : 'Kambing'} - ${animal.kode}</h2>
                            <p><strong>Nama Kegiatan:</strong> QurbanKu - Masjid As Sakinah</p>
                            <p><strong>Keterangan:</strong> ${label}</p>
                            ${isSapi && animal.kode.startsWith('S-0') && parseInt(animal.kode.split('-')[1]) <= 5 ? `<p><strong>Daftar 7 Orang (Patungan):</strong> ${getPatunganNames(animal.kode).join(', ')}</p>` : ''}
                            <div style='margin-top:20px;' id='qr'></div>
                            <script>
                              document.getElementById('qr').innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}" alt="QR Code" />';
                            </script>
                          </body></html>`);
                        w.document.close();
                        setTimeout(() => w.print(), 1000);
                      }
                    }}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Cetak
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Editing Dialog Modal */}
      {editingAnimal && (
        <Dialog open={true} onOpenChange={() => setEditingAnimal(null)}>
          <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Edit Progres {getAnimalLabel(editingAnimal)}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Status Select */}
              <div className="space-y-1.5">
                <Label htmlFor="status">Status Proses</Label>
                <Select value={editStatus || 'daftar'} onValueChange={(val: any) => setEditStatus(val)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daftar">DAFTAR</SelectItem>
                    <SelectItem value="diterima">DITERIMA</SelectItem>
                    <SelectItem value="disembelih">DISEMBELIH</SelectItem>
                    <SelectItem value="dipotong">POTONG/KULITI</SelectItem>
                    <SelectItem value="distribusi">DISTRIBUSI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bobot">Berat Hidup (kg)</Label>
                  <Input 
                    id="bobot" 
                    type="number" 
                    placeholder="kg" 
                    value={editBobot} 
                    onChange={(e) => setEditBobot(e.target.value)}
                  />
                </div>
                {editingAnimal.jenis === 'sapi' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="ld">Lingkar Dada (cm)</Label>
                    <Input 
                      id="ld" 
                      type="number" 
                      placeholder="cm" 
                      value={editLd} 
                      onChange={(e) => setEditLd(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Live Estimate Preview */}
              <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg flex justify-between items-center text-xs">
                <span className="font-semibold text-blue-800 uppercase flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" />
                  Estimasi Berat Daging:
                </span>
                <span className="font-bold text-blue-900 text-sm">
                  {(() => {
                    let b = parseFloat(editBobot) || 0;
                    if (b === 0 && editingAnimal.jenis === 'sapi') {
                      const ld = parseFloat(editLd) || 0;
                      if (ld > 0) b = Math.pow(ld + 22, 2) / 100;
                    }
                    const ratio = editingAnimal.jenis === 'sapi' ? 0.38 : 0.356;
                    return b > 0 ? `${Math.round(b * ratio)} kg` : '-';
                  })()}
                </span>
              </div>

              {/* Media Documentation Area */}
              <div className="space-y-2 border-t pt-3">
                <Label>Dokumentasi Foto / Video</Label>
                
                {/* Thumbnails */}
                {editingAnimal.fotoUrls && editingAnimal.fotoUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 py-1 max-h-48 overflow-y-auto">
                    {editingAnimal.fotoUrls.map((url, i) => (
                      <div key={i} className="relative group bg-black rounded overflow-hidden aspect-square flex items-center justify-center border">
                        {url.startsWith('data:video/') ? (
                          <Video className="h-6 w-6 text-gray-300" />
                        ) : (
                          <img src={url} alt="Hewan" className="w-full h-full object-cover" />
                        )}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-5 w-5"
                          onClick={() => removeFotoFromHewan(editingAnimal.id, i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <div>
                  <Label 
                    htmlFor={`photo-upload-${editingAnimal.id}`} 
                    className="cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-100 font-semibold border border-blue-200 text-sm transition-colors"
                  >
                    <Camera className="h-4.5 w-4.5" />
                    Ambil Foto / Video
                  </Label>
                  <input 
                    id={`photo-upload-${editingAnimal.id}`} 
                    type="file" 
                    accept="image/*,video/*" 
                    capture="environment"
                    className="hidden" 
                    onChange={(e) => handlePhotoUpload(editingAnimal.id, e)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3 mt-2">
              <Button variant="outline" onClick={() => setEditingAnimal(null)}>
                Batal
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 font-semibold">
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Code Dialog Modal */}
      {qrAnimal && (
        <Dialog open={true} onOpenChange={() => setQrAnimal(null)}>
          <DialogContent className="sm:max-w-[300px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-center">QR Code - {qrAnimal.kode}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border mt-3">
              <QRCodeSVG value={`${window.location.origin}/animal/${qrAnimal.id}`} size={180} />
            </div>
            <p className="text-xs text-center text-gray-500 mt-2 font-medium">{getAnimalLabel(qrAnimal)}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AnimalDataForm;
