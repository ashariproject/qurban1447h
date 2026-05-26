import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQurban, HewanData } from "@/contexts/QurbanContext";
import { compressImage } from "@/utils/imageCompressor";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Loader2, Beef } from "lucide-react";

const AnimalProcessForm = () => {
  const { hewanList, shohibulList, updateHewanStatus, addFotoToHewan, removeFotoFromHewan } = useQurban();
  const { toast } = useToast();

  const [selectedHewanId, setSelectedHewanId] = useState<string>("");
  const [selectedHewan, setSelectedHewan] = useState<HewanData | null>(null);
  
  // Status states
  const [isSembelih, setIsSembelih] = useState<boolean>(false);
  const [isPotong, setIsPotong] = useState<boolean>(false);
  
  // Photo states
  const [uploading, setUploading] = useState<boolean>(false);
  const [stagedPhotos, setStagedPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  // Sync select option
  useEffect(() => {
    if (selectedHewanId) {
      const found = hewanList.find(h => h.id === selectedHewanId) || null;
      setSelectedHewan(found);
      if (found) {
        setIsSembelih(found.status === 'disembelih' || found.status === 'dipotong' || found.status === 'distribusi');
        setIsPotong(found.status === 'dipotong' || found.status === 'distribusi');
      }
      setStagedPhotos([]);
    } else {
      setSelectedHewan(null);
      setIsSembelih(false);
      setIsPotong(false);
      setStagedPhotos([]);
    }
  }, [selectedHewanId, hewanList]);

  // Sort animal list: Sapi first, then Kambing
  const sortedHewanList = [...hewanList].sort((a, b) => {
    if (a.jenis !== b.jenis) {
      return a.jenis === 'sapi' ? -1 : 1;
    }
    return a.kode.localeCompare(b.kode);
  });

  const getShohibulName = (animal: HewanData) => {
    const shohibul = shohibulList.find(s => s.id === animal.shohibulId);
    if (!shohibul) return "Hamba Allah";
    return shohibul.nama;
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = async () => {
            try {
              const compressed = await compressImage(reader.result as string);
              setStagedPhotos(prev => [...prev, compressed]);
            } catch (err) {
              console.error("Compression failed", err);
              setStagedPhotos(prev => [...prev, reader.result as string]);
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      toast({
        title: "Foto Berhasil Dimuat",
        description: `${files.length} foto telah siap disimpan & dikompres otomatis.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Gagal memuat foto",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveStagedPhoto = (idx: number) => {
    setStagedPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveStatus = async () => {
    if (!selectedHewan) return;
    setSaving(true);
    try {
      // 1. Determine status
      let nextStatus: HewanData['status'] = 'diterima';
      if (isPotong) {
        nextStatus = 'dipotong';
      } else if (isSembelih) {
        nextStatus = 'disembelih';
      } else {
        nextStatus = selectedHewan.status === 'daftar' ? 'daftar' : 'diterima';
      }

      // Update status if changed
      if (nextStatus !== selectedHewan.status) {
        await updateHewanStatus(selectedHewan.id, nextStatus);
      }

      // 2. Upload photos if any staged
      if (stagedPhotos.length > 0) {
        for (const photo of stagedPhotos) {
          await addFotoToHewan(selectedHewan.id, photo);
        }
      }

      toast({
        title: "Progres Berhasil Disimpan",
        description: `Hewan ${selectedHewan.kode} telah diperbarui ke status ${nextStatus.toUpperCase()}.`,
      });

      // Reset staged photos
      setStagedPhotos([]);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Gagal menyimpan progres",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          <Beef className="h-5 w-5" />
          Form Update Progres Penyembelihan
        </CardTitle>
        <CardDescription className="text-blue-100 text-xs">
          Perbarui status dan upload foto dokumentasi hewan qurban saat penyembelihan secara real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Hewan Select Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="hewan-select" className="text-sm font-semibold">Pilih Hewan Qurban</Label>
          <Select value={selectedHewanId} onValueChange={setSelectedHewanId}>
            <SelectTrigger id="hewan-select" className="w-full h-11 rounded-lg border-gray-200">
              <SelectValue placeholder="Pilih kode hewan (contoh: S-01, K-01)" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {sortedHewanList.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.kode} - {h.jenis.toUpperCase()} ({getShohibulName(h)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedHewan && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Status Checkboxes */}
            <div className="bg-slate-50 border rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Tahapan</h3>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="sembelih" 
                  checked={isSembelih} 
                  onCheckedChange={(val) => {
                    setIsSembelih(!!val);
                    if (!val) setIsPotong(false); // Can't be flayed if not slaughtered
                  }}
                  className="mt-1"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="sembelih" className="text-sm font-semibold cursor-pointer">Hewan Sudah Disembelih</Label>
                  <p className="text-xs text-slate-500">Tandai jika proses penyembelihan hewan telah selesai dilakukan.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t pt-4">
                <Checkbox 
                  id="potong" 
                  checked={isPotong} 
                  onCheckedChange={(val) => {
                    setIsPotong(!!val);
                    if (val) setIsSembelih(true); // Must be slaughtered if flayed
                  }}
                  className="mt-1"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="potong" className="text-sm font-semibold cursor-pointer">Hewan Sudah Dipotong & Dikuliti</Label>
                  <p className="text-xs text-slate-500">Tandai jika proses pengeletan (kulit & potong karkas) selesai.</p>
                </div>
              </div>
            </div>

            {/* Photo Documentation Area */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Dokumentasi Foto Penyembelihan</Label>
              
              {/* Existing Photos Grid */}
              {selectedHewan.fotoUrls && selectedHewan.fotoUrls.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Foto Saat Ini</span>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedHewan.fotoUrls.map((url, i) => (
                      <div key={i} className="relative group bg-slate-100 rounded-lg overflow-hidden aspect-square border">
                        <img src={url} alt="Hewan" className="w-full h-full object-cover" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFotoFromHewan(selectedHewan.id, i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staged (Newly uploaded but unsaved) Photos Grid */}
              {stagedPhotos.length > 0 && (
                <div className="space-y-2 bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">Foto Baru (Belum Disimpan)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {stagedPhotos.map((url, i) => (
                      <div key={i} className="relative bg-slate-100 rounded-lg overflow-hidden aspect-square border border-blue-200">
                        <img src={url} alt="New Staged" className="w-full h-full object-cover" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-5 w-5"
                          onClick={() => handleRemoveStagedPhoto(i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Input Button */}
              <div>
                <Label 
                  htmlFor="slaughter-photo" 
                  className="cursor-pointer flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-3 rounded-lg hover:bg-blue-100 font-semibold border border-blue-200 text-sm transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4.5 w-4.5" />
                  )}
                  Ambil / Upload Foto Penyembelihan
                </Label>
                <input 
                  id="slaughter-photo" 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  multiple
                  disabled={uploading || saving}
                  className="hidden" 
                  onChange={handlePhotoSelect}
                />
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSaveStatus} 
              disabled={saving}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Progres & Foto"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalProcessForm;
