import React, { useState } from 'react';
import { useQurban } from '@/contexts/QurbanContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Package, Truck, CheckCircle2, ShieldAlert } from 'lucide-react';

const ShohibulDistribution = () => {
  const { shohibulList, updateShohibulStatus } = useQurban();
  const { user } = useAuth();
  
  // Local state to handle typing in the input field before saving (debounced save)
  const [requestInputs, setRequestInputs] = useState<Record<string, string>>({});

  const currentUserRole = user?.role || 'admin';
  const isAdmin = currentUserRole === 'admin';
  const isShohibulOfficer = currentUserRole === 'shohibul';
  const isDistributionOfficer = currentUserRole === 'distribution';

  const canEditShohibulPhase = isAdmin || isShohibulOfficer;
  const canEditDistributionPhase = isAdmin || isDistributionOfficer;

  const handleStatusChange = (id: string, field: string, value: boolean) => {
    updateShohibulStatus(id, field, value);
  };

  const handleRequestChange = (id: string, value: string) => {
    setRequestInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleRequestSave = (id: string) => {
    if (requestInputs[id] !== undefined) {
      updateShohibulStatus(id, 'requestIsian', requestInputs[id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Distribusi Shohibul
          </h1>
          <p className="text-gray-500">Kelola request dan pantau pengiriman hak daging shohibul.</p>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <span className="font-semibold block mb-1">Akses Sesuai Peran:</span>
            {isShohibulOfficer ? (
              <p>Anda bertugas mengisi <strong>Request</strong> dan menandai <strong>Daging Siap</strong>. Status Pengiriman akan diisi oleh Petugas Distribusi.</p>
            ) : (
              <p>Anda bertugas memperbarui status <strong>Pengiriman</strong> dan <strong>Sudah Diterima</strong>. Request shohibul dikelola oleh Petugas Shohibul.</p>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Distribusi Hak Shohibul</CardTitle>
          <CardDescription>
            Centang kotak untuk mengupdate status secara real-time. Tekan Enter untuk menyimpan Request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead className="min-w-[150px]">Nama & Jenis</TableHead>
                  <TableHead className="w-[200px]">Request (Isian)</TableHead>
                  <TableHead className="text-center w-[120px]">Daging Siap</TableHead>
                  <TableHead className="text-center w-[120px]">Pengiriman</TableHead>
                  <TableHead className="text-center w-[120px]">Sudah Diterima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shohibulList.map((s, index) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{s.nama}</div>
                      <div className="text-xs text-gray-500 uppercase">{s.jenisQurban.replace('-', ' ')}</div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        placeholder="Contoh: Ambil sendiri..." 
                        value={requestInputs[s.id] !== undefined ? requestInputs[s.id] : (s.status.requestIsian || '')}
                        onChange={(e) => handleRequestChange(s.id, e.target.value)}
                        onBlur={() => handleRequestSave(s.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        disabled={!canEditShohibulPhase}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={s.status.siapKirim}
                        onCheckedChange={(c) => handleStatusChange(s.id, 'siapKirim', !!c)}
                        disabled={!canEditShohibulPhase}
                        className="mx-auto data-[state=checked]:bg-blue-600 border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={s.status.pengiriman}
                        onCheckedChange={(c) => handleStatusChange(s.id, 'pengiriman', !!c)}
                        disabled={!canEditDistributionPhase}
                        className="mx-auto data-[state=checked]:bg-orange-500 border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={s.status.telahTerima}
                        onCheckedChange={(c) => handleStatusChange(s.id, 'telahTerima', !!c)}
                        disabled={!canEditDistributionPhase}
                        className="mx-auto data-[state=checked]:bg-green-600 border-gray-300"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {shohibulList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Belum ada data shohibul.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShohibulDistribution;
