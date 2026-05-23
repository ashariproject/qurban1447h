
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Truck, Plus, Search, MapPin, Clock, Route } from 'lucide-react';

interface DistributionRoute {
  id: string;
  namaRute: string;
  driver: string;
  kendaraan: string;
  wilayahTujuan: string[];
  estimasiWaktu: string;
  jumlahPaket: number;
  status: 'planned' | 'active' | 'completed';
  tanggalRencana: string;
  catatan: string;
}

const DistributionRoutes = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    namaRute: '',
    driver: '',
    kendaraan: '',
    wilayahTujuan: [] as string[],
    estimasiWaktu: '',
    jumlahPaket: 0,
    tanggalRencana: '',
    catatan: ''
  });

  // Sample data - Reset to empty for fresh start
  const [routes, setRoutes] = useState<DistributionRoute[]>([]);

  const wilayahOptions = [
    'Pantai Mentari Sektor 1',
    'Pantai Mentari Sektor 2',
    'Pantai Mentari Sektor 3',
    'Pantai Mentari Sektor 4',
    'Pantai Mentari Sektor 5',
    'Pantai Mentari Sektor 6',
    'Komplek AL Gang 1',
    'Komplek AL Gang 2',
    'Komplek AL Gang 3',
    'Komplek AL Gang 4',
    'Warga Lain Area Umum'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: DistributionRoute = {
      id: `RT${String(routes.length + 1).padStart(3, '0')}`,
      namaRute: formData.namaRute,
      driver: formData.driver,
      kendaraan: formData.kendaraan,
      wilayahTujuan: formData.wilayahTujuan,
      estimasiWaktu: formData.estimasiWaktu,
      jumlahPaket: formData.jumlahPaket,
      status: 'planned',
      tanggalRencana: formData.tanggalRencana,
      catatan: formData.catatan
    };
    
    setRoutes([...routes, newRoute]);
    setFormData({
      namaRute: '',
      driver: '',
      kendaraan: '',
      wilayahTujuan: [],
      estimasiWaktu: '',
      jumlahPaket: 0,
      tanggalRencana: '',
      catatan: ''
    });
    setShowForm(false);
    alert('Rute distribusi berhasil ditambahkan!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Aktif</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Direncanakan</Badge>;
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.namaRute.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.wilayahTujuan.some(w => w.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleWilayahChange = (wilayah: string) => {
    if (formData.wilayahTujuan.includes(wilayah)) {
      setFormData({
        ...formData,
        wilayahTujuan: formData.wilayahTujuan.filter(w => w !== wilayah)
      });
    } else {
      setFormData({
        ...formData,
        wilayahTujuan: [...formData.wilayahTujuan, wilayah]
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Rute Distribusi</h1>
          <p className="text-purple-100">Kelola rute pendistribusian daging qurban ke seluruh wilayah</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Route className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Rute</p>
                  <p className="text-2xl font-bold">{routes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Rute Aktif</p>
                  <p className="text-2xl font-bold">{routes.filter(r => r.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Direncanakan</p>
                  <p className="text-2xl font-bold">{routes.filter(r => r.status === 'planned').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Paket</p>
                  <p className="text-2xl font-bold">{routes.reduce((sum, r) => sum + r.jumlahPaket, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari rute..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Tambah Rute</span>
          </Button>
        </div>

        {/* Form Input */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Form Input Rute Distribusi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="namaRute">Nama Rute</Label>
                    <Input
                      id="namaRute"
                      value={formData.namaRute}
                      onChange={(e) => setFormData({...formData, namaRute: e.target.value})}
                      placeholder="contoh: Rute Pantai Mentari"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver">Driver/Petugas</Label>
                    <Input
                      id="driver"
                      value={formData.driver}
                      onChange={(e) => setFormData({...formData, driver: e.target.value})}
                      placeholder="Nama petugas pengantaran"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="kendaraan">Kendaraan</Label>
                    <Input
                      id="kendaraan"
                      value={formData.kendaraan}
                      onChange={(e) => setFormData({...formData, kendaraan: e.target.value})}
                      placeholder="Jenis dan nomor kendaraan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimasiWaktu">Estimasi Waktu</Label>
                    <Input
                      id="estimasiWaktu"
                      value={formData.estimasiWaktu}
                      onChange={(e) => setFormData({...formData, estimasiWaktu: e.target.value})}
                      placeholder="contoh: 3 jam"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="jumlahPaket">Jumlah Paket</Label>
                    <Input
                      id="jumlahPaket"
                      type="number"
                      min="0"
                      value={formData.jumlahPaket}
                      onChange={(e) => setFormData({...formData, jumlahPaket: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggalRencana">Tanggal Rencana</Label>
                    <Input
                      id="tanggalRencana"
                      type="date"
                      value={formData.tanggalRencana}
                      onChange={(e) => setFormData({...formData, tanggalRencana: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Wilayah Tujuan</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded p-3">
                    {wilayahOptions.map((wilayah) => (
                      <label key={wilayah} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.wilayahTujuan.includes(wilayah)}
                          onChange={() => handleWilayahChange(wilayah)}
                          className="rounded"
                        />
                        <span className="text-sm">{wilayah}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Terpilih: {formData.wilayahTujuan.length} wilayah
                  </p>
                </div>

                <div>
                  <Label htmlFor="catatan">Catatan</Label>
                  <Textarea
                    id="catatan"
                    value={formData.catatan}
                    onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    placeholder="Catatan khusus untuk rute ini"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">Simpan Rute</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Rute Distribusi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama Rute</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Wilayah Tujuan</TableHead>
                    <TableHead>Estimasi</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>{route.namaRute}</TableCell>
                      <TableCell>{route.driver}</TableCell>
                      <TableCell>{route.kendaraan}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {route.wilayahTujuan.slice(0, 2).map((wilayah, index) => (
                            <div key={index} className="text-sm">{wilayah}</div>
                          ))}
                          {route.wilayahTujuan.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{route.wilayahTujuan.length - 2} lainnya
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{route.estimasiWaktu}</TableCell>
                      <TableCell>{route.jumlahPaket}</TableCell>
                      <TableCell>{getStatusBadge(route.status)}</TableCell>
                      <TableCell>{route.tanggalRencana}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DistributionRoutes;
