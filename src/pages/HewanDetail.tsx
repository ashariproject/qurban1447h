import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQurban } from '@/contexts/QurbanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HewanDetail = () => {
  const { id } = useParams();
  const { hewanList, shohibulList } = useQurban();
  const hewan = hewanList.find(h => h.id === id);
  const shohibul = hewan ? shohibulList.find(s => s.id === hewan.shohibulId) : null;

  if (!hewan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-muted-foreground">Hewan tidak ditemukan.</p>
            <Button asChild><Link to="/">Beranda</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-2xl mx-auto space-y-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{hewan.kode}</CardTitle>
                <p className="text-muted-foreground capitalize">{hewan.jenis}</p>
              </div>
              <Badge>{hewan.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {shohibul && (
              <div className="border rounded-lg p-4 space-y-1">
                <h3 className="font-semibold">Shohibul (Pengqurban)</h3>
                <p>{shohibul.nama}</p>
                <p className="text-sm text-muted-foreground">{shohibul.alamat}</p>
                <p className="text-sm text-muted-foreground">{shohibul.noTelepon}</p>
              </div>
            )}

            {hewan.fotoUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {hewan.fotoUrls.map((u, i) => (
                  <img key={i} src={u} alt={`foto-${i}`} className="w-full h-40 object-cover rounded" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada foto dokumentasi.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HewanDetail;
