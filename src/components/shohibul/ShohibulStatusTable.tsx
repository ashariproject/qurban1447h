
import React, { useState } from 'react';
import { ShohibulStatusData } from '@/pages/shohibul/Dashboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Truck, Package, Users, Camera, Eye, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ShohibulStatusTableProps {
  data: ShohibulStatusData[];
  onUpdateStatus: (id: string, field: string, value: any) => void;
}

const ShohibulStatusTable: React.FC<ShohibulStatusTableProps> = ({
  data,
  onUpdateStatus,
}) => {
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    const matchesJenis = filterJenis === 'all' || item.jenisQurban === filterJenis;
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJenis && matchesSearch;
  });

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-300" />
    );
  };

  const handlePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateStatus(id, 'fotoTerima', reader.result as string);
        onUpdateStatus(id, 'telahTerima', true); // Automatically mark as received when photo uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const getJenisLabel = (jenis: string) => {
    switch (jenis) {
      case 'sapi-mandiri':
        return 'Sapi Mandiri';
      case 'kambing-mandiri':
        return 'Kambing Mandiri';
      case 'kambing-titip-beli':
        return 'Kambing (Titip Beli)';
      case 'sapi-patungan':
        return 'Sapi Patungan';
      default:
        return jenis;
    }
  };

  // Calculate summary statistics
  const totalShohibul = filteredData.length;
  const sudahDatang = filteredData.filter(item => item.statusDatang).length;
  const siapSembelih = filteredData.filter(item => item.statusSiapSembelih).length;
  const siapKirim = filteredData.filter(item => item.statusSiapKirim).length;
  const telahTerima = filteredData.filter(item => item.statusTelahTerima).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{totalShohibul}</div>
                <div className="text-xs text-gray-600">Total Shohibul</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{sudahDatang}</div>
                <div className="text-xs text-gray-600">Sudah Datang</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{siapSembelih}</div>
                <div className="text-xs text-gray-600">Siap Sembelih</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{siapKirim}</div>
                <div className="text-xs text-gray-600">Siap Kirim</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{telahTerima}</div>
                <div className="text-xs text-gray-600">Telah Terima</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Status Shohibul Qurban</CardTitle>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Cari nama shohibul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterJenis} onValueChange={setFilterJenis}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Jenis Qurban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="sapi-mandiri">Sapi Mandiri</SelectItem>
                <SelectItem value="kambing-mandiri">Kambing Mandiri</SelectItem>
                <SelectItem value="kambing-titip-beli">Kambing (Titip Beli)</SelectItem>
                <SelectItem value="sapi-patungan">Sapi Patungan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data shohibul yang sesuai dengan filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500">PATUNGAN</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500">No</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500">Nama Shohibul</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500">Jenis</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500">Jumlah</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500 text-center">Datang</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500 text-center">Sembelih</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500 text-center">Kirim</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500 text-center">Terima</TableHead>
                    <TableHead className="py-2 text-[10px] uppercase font-bold text-gray-500 text-center">Foto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    let patunganCounter = 0;
                    return filteredData.map((item, index) => {
                      const isPatungan = item.jenisQurban === 'sapi-patungan';
                      const pIdx = isPatungan ? patunganCounter++ : -1;
                      const groupNum = isPatungan ? Math.floor(pIdx / 7) : -1;
                      const isGroupStart = isPatungan && (pIdx % 7 === 0);
                      
                      // Alternating background for groups
                      const rowBg = isPatungan 
                        ? (groupNum % 2 === 0 ? 'bg-blue-50/50' : 'bg-indigo-50/30') 
                        : '';
                      
                      return (
                        <TableRow 
                          key={item.id} 
                          className={`${rowBg} hover:bg-gray-100/50 transition-colors ${isGroupStart ? 'border-t-2 border-blue-200' : ''}`}
                        >
                          <TableCell className="py-1 px-2 font-bold text-blue-700 text-[10px]">
                            {isGroupStart ? `PATUNGAN ${groupNum + 1}` : ''}
                          </TableCell>
                          <TableCell className="py-1 px-2 text-xs">{index + 1}</TableCell>
                          <TableCell className="py-1 px-2 font-semibold text-sm truncate max-w-[150px]">{item.nama}</TableCell>
                          <TableCell className="py-1 px-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              item.jenisQurban === 'sapi-mandiri' 
                                ? 'bg-blue-100 text-blue-800'
                                : item.jenisQurban === 'kambing-mandiri'
                                ? 'bg-green-100 text-green-800'
                                : item.jenisQurban === 'kambing-titip-beli'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {item.jenisQurban.split('-')[0]}
                            </span>
                          </TableCell>
                          <TableCell className="py-1 px-2 text-xs font-medium">{item.jumlahHewan} ekor</TableCell>
                          <TableCell className="py-1 px-2 text-center">
                            <Button
                              variant={item.statusDatang ? "default" : "outline"}
                              size="sm"
                              onClick={() => onUpdateStatus(item.id, 'statusDatang', !item.statusDatang)}
                              className={`w-6 h-6 p-0 ${item.statusDatang ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                              {getStatusIcon(item.statusDatang)}
                            </Button>
                          </TableCell>
                          <TableCell className="py-1 px-2 text-center">
                            <Button
                              variant={item.statusSiapSembelih ? "default" : "outline"}
                              size="sm"
                              onClick={() => onUpdateStatus(item.id, 'statusSiapSembelih', !item.statusSiapSembelih)}
                              className={`w-6 h-6 p-0 ${item.statusSiapSembelih ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              disabled={!item.statusDatang}
                            >
                              {getStatusIcon(item.statusSiapSembelih)}
                            </Button>
                          </TableCell>
                          <TableCell className="py-1 px-2 text-center">
                            <Button
                              variant={item.statusSiapKirim ? "default" : "outline"}
                              size="sm"
                              onClick={() => onUpdateStatus(item.id, 'statusSiapKirim', !item.statusSiapKirim)}
                              className={`w-6 h-6 p-0 ${item.statusSiapKirim ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              disabled={!item.statusSiapSembelih}
                            >
                              {getStatusIcon(item.statusSiapKirim)}
                            </Button>
                          </TableCell>
                          <TableCell className="py-1 px-2 text-center">
                            <Button
                              variant={item.statusTelahTerima ? "default" : "outline"}
                              size="sm"
                              onClick={() => onUpdateStatus(item.id, 'statusTelahTerima', !item.statusTelahTerima)}
                              className={`w-6 h-6 p-0 ${item.statusTelahTerima ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              disabled={!item.statusSiapKirim}
                            >
                              {getStatusIcon(item.statusTelahTerima)}
                            </Button>
                          </TableCell>
                          <TableCell className="py-1 px-2 text-center">
                            <div className="flex justify-center gap-1">
                              {item.fotoTerima ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 border-blue-200 bg-blue-50 text-blue-600">
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Bukti Penerimaan - {item.nama}</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <img src={item.fotoTerima} alt="Bukti Terima" className="w-full h-auto rounded-lg shadow-md" />
                                      <div className="mt-4 flex justify-end">
                                        <Label htmlFor={`update-photo-${item.id}`} className="cursor-pointer">
                                          <div className="flex items-center gap-2 text-xs text-blue-600 font-bold hover:underline">
                                            <Camera className="h-4 w-4" />
                                            GANTI FOTO
                                          </div>
                                          <input 
                                            id={`update-photo-${item.id}`} 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={(e) => handlePhotoUpload(item.id, e)}
                                          />
                                        </Label>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <Label htmlFor={`upload-photo-${item.id}`} className="cursor-pointer">
                                  <div className={`flex items-center justify-center h-6 w-6 rounded-md border border-dashed transition-colors ${item.statusSiapKirim ? 'border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100' : 'border-gray-200 bg-gray-50 text-gray-400 opacity-50 pointer-events-none'}`}>
                                    <Camera className="h-3 w-3" />
                                  </div>
                                  <input 
                                    id={`upload-photo-${item.id}`} 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    disabled={!item.statusSiapKirim}
                                    onChange={(e) => handlePhotoUpload(item.id, e)}
                                  />
                                </Label>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShohibulStatusTable;
