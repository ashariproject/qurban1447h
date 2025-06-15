
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DistributionInputForm from '@/components/distribution/DistributionInputForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, CheckCircle, Clock, MapPin, Package, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeliveryRecord {
  id: string;
  tanggal: string;
  jenisDistribusi: 'shohibul' | 'warga';
  penerima: string;
  noHp: string;
  wilayah: string;
  sektor: string;
  jumlahPaket: number;
  jenisKemasan: string;
  status: 'terkirim' | 'belum' | 'dalam_perjalanan';
  waktuKirim?: string;
  catatan?: string;
}

const DeliveryStatus = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [wilayahFilter, setWilayahFilter] = useState<string>('semua');

  // Sample data - dalam implementasi nyata akan dari database
  const [deliveryData, setDeliveryData] = useState<DeliveryRecord[]>([
    {
      id: 'DST001',
      tanggal: '2024-06-15',
      jenisDistribusi: 'shohibul',
      penerima: 'Ahmad Suryanto',
      noHp: '081234567890',
      wilayah: 'Pantai Mentari',
      sektor: 'Sektor 1 - Pantai Mentari Timur',
      jumlahPaket: 3,
      jenisKemasan: '2 Kg',
      status: 'terkirim',
      waktuKirim: '08:30',
      catatan: 'Diterima langsung oleh yang bersangkutan'
    },
    {
      id: 'DST002',
      tanggal: '2024-06-15',
      jenisDistribusi: 'warga',
      penerima: 'Siti Nurhaliza',
      noHp: '081234567891',
      wilayah: 'Komplek AL',
      sektor: 'Gang 1 - Jl. Laksamana',
      jumlahPaket: 2,
      jenisKemasan: '1 Kg',
      status: 'dalam_perjalanan',
      catatan: 'Tim sedang menuju lokasi'
    },
    {
      id: 'DST003',
      tanggal: '2024-06-15',
      jenisDistribusi: 'warga',
      penerima: 'Budi Santoso',
      noHp: '081234567892',
      wilayah: 'Pantai Mentari',
      sektor: 'Sektor 3 - Pantai Mentari Utara',
      jumlahPaket: 1,
      jenisKemasan: '5 Kg',
      status: 'belum',
      catatan: 'Menunggu konfirmasi penerima'
    }
  ]);

  const updateStatus = (id: string, newStatus: 'terkirim' | 'belum' | 'dalam_perjalanan') => {
    setDeliveryData(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: newStatus, waktuKirim: newStatus === 'terkirim' ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : item.waktuKirim }
          : item
      )
    );
    
    const statusText = {
      'terkirim': 'Terkirim',
      'belum': 'Belum Terkirim',
      'dalam_perjalanan': 'Dalam Perjalanan'
    };
    
    toast({
      title: "Status Updated",
      description: `Status pengiriman ${id} berhasil diubah menjadi ${statusText[newStatus]}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'terkirim':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Terkirim</Badge>;
      case 'dalam_perjalanan':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" />Dalam Perjalanan</Badge>;
      case 'belum':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><Clock className="w-3 h-3 mr-1" />Belum Terkirim</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredData = deliveryData.filter(item => {
    const matchesSearch = item.penerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.wilayah.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'semua' || item.status === statusFilter;
    const matchesWilayah = wilayahFilter === 'semua' || item.wilayah.toLowerCase().includes(wilayahFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesWilayah;
  });

  const getStats = () => {
    const total = deliveryData.length;
    const terkirim = deliveryData.filter(item => item.status === 'terkirim').length;
    const dalamPerjalanan = deliveryData.filter(item => item.status === 'dalam_perjalanan').length;
    const belum = deliveryData.filter(item => item.status === 'belum').length;
    
    return { total, terkirim, dalamPerjalanan, belum };
  };

  const stats = getStats();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Status Pengiriman</h1>
          <p className="text-gray-500">Pantau dan perbarui status pengiriman: terkirim / belum.</p>
        </div>

        {/* Statistik Pengiriman */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Pengiriman</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Terkirim</p>
                  <p className="text-2xl font-bold text-green-600">{stats.terkirim}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Dalam Perjalanan</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.dalamPerjalanan}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Belum Terkirim</p>
                  <p className="text-2xl font-bold text-red-600">{stats.belum}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DistributionInputForm />
        
        {/* Filter dan Pencarian */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Status Distribusi Terkini
            </CardTitle>
            <CardDescription>
              Pantau dan kelola status pengiriman daging qurban
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama penerima, wilayah, atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="terkirim">Terkirim</SelectItem>
                  <SelectItem value="dalam_perjalanan">Dalam Perjalanan</SelectItem>
                  <SelectItem value="belum">Belum Terkirim</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={wilayahFilter} onValueChange={setWilayahFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter Wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Wilayah</SelectItem>
                  <SelectItem value="pantai mentari">Pantai Mentari</SelectItem>
                  <SelectItem value="komplek al">Komplek AL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabel Data */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead>Wilayah/Sektor</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Tidak ada data pengiriman yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell>{item.tanggal}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.penerima}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {item.noHp}
                            </div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {item.jenisDistribusi === 'shohibul' ? 'Shohibul' : 'Warga'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 mt-1 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{item.wilayah}</p>
                              <p className="text-xs text-gray-500">{item.sektor}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.jumlahPaket} paket</p>
                            <p className="text-sm text-gray-500">{item.jenisKemasan}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {getStatusBadge(item.status)}
                            {item.waktuKirim && (
                              <p className="text-xs text-gray-500 mt-1">{item.waktuKirim}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Select 
                              value={item.status} 
                              onValueChange={(value: 'terkirim' | 'belum' | 'dalam_perjalanan') => updateStatus(item.id, value)}
                            >
                              <SelectTrigger className="w-40 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="belum">Belum Terkirim</SelectItem>
                                <SelectItem value="dalam_perjalanan">Dalam Perjalanan</SelectItem>
                                <SelectItem value="terkirim">Terkirim</SelectItem>
                              </SelectContent>
                            </Select>
                            {item.catatan && (
                              <p className="text-xs text-gray-500 italic">{item.catatan}</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredData.length > 0 && (
              <div className="text-sm text-gray-500 text-center">
                Menampilkan {filteredData.length} dari {deliveryData.length} data pengiriman
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DeliveryStatus;
