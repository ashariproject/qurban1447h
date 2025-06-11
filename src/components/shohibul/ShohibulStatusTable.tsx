
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
import { CheckCircle, XCircle, Clock, Truck, Package, Users } from 'lucide-react';

interface ShohibulStatusTableProps {
  data: ShohibulStatusData[];
  onUpdateStatus: (id: string, field: string, value: boolean) => void;
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
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
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
                    <TableHead>No</TableHead>
                    <TableHead>Nama Shohibul</TableHead>
                    <TableHead>Jenis Qurban</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Sudah Datang</TableHead>
                    <TableHead>Siap Sembelih</TableHead>
                    <TableHead>Siap Kirim</TableHead>
                    <TableHead>Telah Terima</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.jenisQurban === 'sapi-mandiri' 
                            ? 'bg-blue-100 text-blue-800'
                            : item.jenisQurban === 'kambing-mandiri'
                            ? 'bg-green-100 text-green-800'
                            : item.jenisQurban === 'kambing-titip-beli'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {getJenisLabel(item.jenisQurban)}
                        </span>
                      </TableCell>
                      <TableCell>{item.jumlahHewan} ekor</TableCell>
                      <TableCell>
                        <Button
                          variant={item.statusDatang ? "default" : "outline"}
                          size="sm"
                          onClick={() => onUpdateStatus(item.id, 'statusDatang', !item.statusDatang)}
                          className="w-8 h-8 p-0"
                        >
                          {getStatusIcon(item.statusDatang)}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={item.statusSiapSembelih ? "default" : "outline"}
                          size="sm"
                          onClick={() => onUpdateStatus(item.id, 'statusSiapSembelih', !item.statusSiapSembelih)}
                          className="w-8 h-8 p-0"
                          disabled={!item.statusDatang}
                        >
                          {getStatusIcon(item.statusSiapSembelih)}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={item.statusSiapKirim ? "default" : "outline"}
                          size="sm"
                          onClick={() => onUpdateStatus(item.id, 'statusSiapKirim', !item.statusSiapKirim)}
                          className="w-8 h-8 p-0"
                          disabled={!item.statusSiapSembelih}
                        >
                          {getStatusIcon(item.statusSiapKirim)}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={item.statusTelahTerima ? "default" : "outline"}
                          size="sm"
                          onClick={() => onUpdateStatus(item.id, 'statusTelahTerima', !item.statusTelahTerima)}
                          className="w-8 h-8 p-0"
                          disabled={!item.statusSiapKirim}
                        >
                          {getStatusIcon(item.statusTelahTerima)}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
