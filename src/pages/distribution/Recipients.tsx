
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
import { Users, Plus, Search, MapPin, Phone } from 'lucide-react';

interface Recipient {
  id: string;
  nama: string;
  alamat: string;
  wilayah: string;
  sektor: string;
  noHp: string;
  jenisKemasan: string;
  jumlahPaket: number;
  status: 'pending' | 'delivered' | 'confirmed';
  tanggalInput: string;
}

const Recipients = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    wilayah: '',
    sektor: '',
    noHp: '',
    jenisKemasan: '',
    jumlahPaket: 1,
    catatan: ''
  });

  // Sample data - Reset to empty for fresh start
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const wilayahOptions = [
    { value: 'pantai_mentari', label: 'Pantai Mentari' },
    { value: 'komplek_al', label: 'Komplek AL' },
    { value: 'warga_lain', label: 'Warga Lain' }
  ];

  const getSektorOptions = (wilayah: string) => {
    if (wilayah === 'pantai_mentari') {
      return ['Sektor 1', 'Sektor 2', 'Sektor 3', 'Sektor 4', 'Sektor 5', 'Sektor 6'];
    } else if (wilayah === 'komplek_al') {
      return ['Gang 1', 'Gang 2', 'Gang 3', 'Gang 4'];
    }
    return ['Area Umum'];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecipient: Recipient = {
      id: `R${String(recipients.length + 1).padStart(3, '0')}`,
      nama: formData.nama,
      alamat: formData.alamat,
      wilayah: wilayahOptions.find(w => w.value === formData.wilayah)?.label || '',
      sektor: formData.sektor,
      noHp: formData.noHp,
      jenisKemasan: formData.jenisKemasan,
      jumlahPaket: formData.jumlahPaket,
      status: 'pending',
      tanggalInput: new Date().toISOString().split('T')[0]
    };
    
    setRecipients([...recipients, newRecipient]);
    setFormData({
      nama: '',
      alamat: '',
      wilayah: '',
      sektor: '',
      noHp: '',
      jenisKemasan: '',
      jumlahPaket: 1,
      catatan: ''
    });
    setShowForm(false);
    alert('Data penerima berhasil ditambahkan!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Terkirim</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Dikonfirmasi</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const filteredRecipients = recipients.filter(recipient =>
    recipient.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.wilayah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Data Penerima</h1>
          <p className="text-teal-100">Kelola data penerima daging qurban dan status distribusi</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Penerima</p>
                  <p className="text-2xl font-bold">{recipients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Terkirim</p>
                  <p className="text-2xl font-bold">{recipients.filter(r => r.status === 'delivered').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{recipients.filter(r => r.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Plus className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Paket</p>
                  <p className="text-2xl font-bold">{recipients.reduce((sum, r) => sum + r.jumlahPaket, 0)}</p>
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
              placeholder="Cari penerima..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Tambah Penerima</span>
          </Button>
        </div>

        {/* Form Input */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Form Input Data Penerima</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nama">Nama Penerima</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="noHp">No. HP</Label>
                    <Input
                      id="noHp"
                      value={formData.noHp}
                      onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="wilayah">Wilayah</Label>
                    <Select
                      value={formData.wilayah}
                      onValueChange={(value) => setFormData({...formData, wilayah: value, sektor: ''})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih wilayah" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayahOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sektor">Sektor/Gang</Label>
                    <Select
                      value={formData.sektor}
                      onValueChange={(value) => setFormData({...formData, sektor: value})}
                      disabled={!formData.wilayah}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih sektor/gang" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSektorOptions(formData.wilayah).map(sektor => (
                          <SelectItem key={sektor} value={sektor}>
                            {sektor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="jenisKemasan">Jenis Kemasan</Label>
                    <Select
                      value={formData.jenisKemasan}
                      onValueChange={(value) => setFormData({...formData, jenisKemasan: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kemasan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Kg">1 Kg</SelectItem>
                        <SelectItem value="2 Kg">2 Kg</SelectItem>
                        <SelectItem value="5 Kg">5 Kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="jumlahPaket">Jumlah Paket</Label>
                    <Input
                      id="jumlahPaket"
                      type="number"
                      min="1"
                      value={formData.jumlahPaket}
                      onChange={(e) => setFormData({...formData, jumlahPaket: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="catatan">Catatan</Label>
                  <Textarea
                    id="catatan"
                    value={formData.catatan}
                    onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Simpan Data</Button>
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
            <CardTitle>Daftar Penerima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Wilayah</TableHead>
                    <TableHead>Sektor</TableHead>
                    <TableHead>No. HP</TableHead>
                    <TableHead>Kemasan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell className="font-medium">{recipient.id}</TableCell>
                      <TableCell>{recipient.nama}</TableCell>
                      <TableCell>{recipient.wilayah}</TableCell>
                      <TableCell>{recipient.sektor}</TableCell>
                      <TableCell>{recipient.noHp}</TableCell>
                      <TableCell>{recipient.jenisKemasan}</TableCell>
                      <TableCell>{recipient.jumlahPaket}</TableCell>
                      <TableCell>{getStatusBadge(recipient.status)}</TableCell>
                      <TableCell>{recipient.tanggalInput}</TableCell>
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

export default Recipients;
