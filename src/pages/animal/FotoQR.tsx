import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { useQurban, HewanData } from '@/contexts/QurbanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Download, Trash2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { compressImage } from "@/utils/imageCompressor";

const HewanFotoQR = () => {
  const { hewanList, shohibulList, addFotoToHewan, removeFotoFromHewan } = useQurban();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'sapi' | 'kambing'>('all');
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const filtered = hewanList.filter(h => filter === 'all' || h.jenis === filter);

  const getShohibul = (id: string) => shohibulList.find(s => s.id === id);

  const handleUpload = async (hewan: HewanData, files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const compressed = await compressImage(reader.result as string);
          addFotoToHewan(hewan.id, compressed);
        } catch (err) {
          console.error("Compression failed, uploading original image", err);
          addFotoToHewan(hewan.id, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    toast({ title: 'Foto ditambahkan', description: `${files.length} foto untuk ${hewan.kode}` });
  };

  const detailUrl = (h: HewanData) => `${window.location.origin}/hewan/${h.id}`;

  const downloadQR = (h: HewanData) => {
    const svg = document.getElementById(`qr-${h.id}`);
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${h.kode}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Foto & QR Hewan Qurban</h1>
          <p className="text-muted-foreground">
            Upload foto dokumentasi setiap hewan dan dapatkan QR code yang terhubung ke data shohibul.
          </p>
        </div>

        <div className="flex gap-2">
          {(['all', 'sapi', 'kambing'] as const).map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
              {f === 'all' ? 'Semua' : f === 'sapi' ? 'Sapi' : 'Kambing'}
            </Button>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card><CardContent className="py-8 text-center text-muted-foreground">
            Belum ada hewan. Tambahkan data shohibul terlebih dahulu.
          </CardContent></Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(h => {
            const s = getShohibul(h.shohibulId);
            return (
              <Card key={h.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{h.kode}</CardTitle>
                      <p className="text-sm text-muted-foreground">{s?.nama ?? 'Tanpa shohibul'}</p>
                    </div>
                    <Badge variant={h.jenis === 'sapi' ? 'default' : 'secondary'}>
                      {h.jenis.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{h.status}</Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><QrCode className="h-4 w-4 mr-1" />QR</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>QR Code — {h.kode}</DialogTitle></DialogHeader>
                        <div className="flex flex-col items-center gap-3 py-4">
                          <QRCodeSVG id={`qr-${h.id}`} value={detailUrl(h)} size={220} includeMargin />
                          <p className="text-xs text-muted-foreground break-all text-center">{detailUrl(h)}</p>
                          <Button size="sm" onClick={() => downloadQR(h)}>
                            <Download className="h-4 w-4 mr-1" />Unduh QR
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {h.fotoUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-1">
                      {h.fotoUrls.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`${h.kode}-${i}`} className="w-full h-20 object-cover rounded" />
                          <Button
                            size="icon" variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => removeFotoFromHewan(h.id, i)}
                          ><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <Input
                      ref={el => (fileInputs.current[h.id] = el)}
                      type="file" accept="image/*" multiple capture="environment"
                      className="hidden"
                      onChange={(e) => handleUpload(h, e.target.files)}
                    />
                    <Button
                      variant="outline" size="sm" className="w-full"
                      onClick={() => fileInputs.current[h.id]?.click()}
                    >
                      <Camera className="h-4 w-4 mr-1" />Tambah Foto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default HewanFotoQR;
