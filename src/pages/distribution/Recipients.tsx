
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Users, Plus, Search, MapPin, Phone, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  rt?: string;
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

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit State
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nama: '',
    alamat: '',
    sektor: '',
    rt: '',
    noHp: ''
  });

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setRecipients(data as Recipient[]);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const wilayahOptions = [
    { value: 'pantai_mentari', label: 'Pantai Mentari' },
    { value: 'komplek_al', label: 'Komplek AL' },
    { value: 'warga_lain', label: 'Warga Lain' }
  ];

  const getSektorOptions = (wilayah: string) => {
    if (wilayah === 'pantai_mentari') {
      return ['RT 01', 'RT 02', 'RT 03', 'RT 04', 'RT 05', 'RT 06', 'RT 07'];
    } else if (wilayah === 'komplek_al') {
      return [
        'Jl. Sadikin', 
        'Jl. Heri Kasiyanto', 
        'Jl. Muhammad', 
        'Jl. Isman', 
        'Jl. Banuriyadi Kadir', 
        'Jl. Mistar', 
        'Jl. Sahabudin'
      ];
    }
    return ['Area Umum'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `R${String(recipients.length + 1).padStart(3, '0')}`;
    const newRecipient: Recipient = {
      id: newId,
      nama: formData.nama,
      alamat: formData.alamat,
      wilayah: wilayahOptions.find(w => w.value === formData.wilayah)?.label || '',
      sektor: formData.sektor,
      rt: formData.wilayah === 'pantai_mentari' ? formData.sektor : undefined,
      noHp: formData.noHp,
      jenisKemasan: formData.jenisKemasan,
      jumlahPaket: formData.jumlahPaket,
      status: 'pending',
      tanggalInput: new Date().toISOString().split('T')[0]
    };
    
    try {
      const { error } = await supabase
        .from('recipients')
        .insert([newRecipient]);
        
      if (error) throw error;
      
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
    } catch (error) {
      console.error('Error adding recipient:', error);
      alert('Gagal menambahkan data. Pastikan tabel Supabase sudah dibuat.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'delivered' ? 'pending' : 'delivered';
    
    // Optimistic update
    setRecipients(recipients.map(r => r.id === id ? { ...r, status: newStatus } : r));
    
    try {
      const { error } = await supabase
        .from('recipients')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        // Revert on error
        setRecipients(recipients.map(r => r.id === id ? { ...r, status: currentStatus as any } : r));
        throw error;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengubah status.');
    }
  };

  const handleEditClick = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setEditFormData({
      nama: recipient.nama,
      alamat: recipient.alamat || '',
      sektor: recipient.sektor || '',
      rt: recipient.rt || '',
      noHp: recipient.noHp || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipient) return;

    try {
      const { error } = await supabase
        .from('recipients')
        .update({
          nama: editFormData.nama,
          alamat: editFormData.alamat,
          sektor: editFormData.sektor,
          rt: editFormData.rt,
          noHp: editFormData.noHp
        })
        .eq('id', editingRecipient.id);

      if (error) throw error;

      setRecipients(recipients.map(r => 
        r.id === editingRecipient.id 
          ? { ...r, ...editFormData } 
          : r
      ));
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating recipient:', error);
      alert('Gagal memperbarui data.');
    }
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

        {/* Data Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Penerima</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Pantai Mentari" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="Pantai Mentari">Pantai Mentari</TabsTrigger>
                <TabsTrigger value="Komplek AL">Komplek AL</TabsTrigger>
                <TabsTrigger value="Warga Lain">Warga Lain</TabsTrigger>
              </TabsList>
              
              {["Pantai Mentari", "Komplek AL", "Warga Lain"].map(wilayahTab => (
                <TabsContent key={wilayahTab} value={wilayahTab}>
                  {wilayahTab === "Pantai Mentari" ? (
                    <Tabs defaultValue="Semua" className="w-full mb-4">
                      <div className="overflow-x-auto pb-2">
                        <TabsList className="min-w-max">
                          <TabsTrigger value="Semua">Semua RT</TabsTrigger>
                          <TabsTrigger value="RT 01">RT 01</TabsTrigger>
                          <TabsTrigger value="RT 02">RT 02</TabsTrigger>
                          <TabsTrigger value="RT 03">RT 03</TabsTrigger>
                          <TabsTrigger value="RT 04">RT 04</TabsTrigger>
                          <TabsTrigger value="RT 05">RT 05</TabsTrigger>
                          <TabsTrigger value="RT 06">RT 06</TabsTrigger>
                          <TabsTrigger value="RT 07">RT 07</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      {["Semua", "RT 01", "RT 02", "RT 03", "RT 04", "RT 05", "RT 06", "RT 07"].map(rtTab => (
                        <TabsContent key={rtTab} value={rtTab}>
                          <div className="overflow-x-auto border rounded-md">
                            <Table>
                              <TableHeader className="bg-gray-50">
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Nama</TableHead>
                                  <TableHead>Blok/Nomor</TableHead>
                                  <TableHead>No. HP</TableHead>
                                  <TableHead>Kemasan</TableHead>
                                  <TableHead>Jumlah</TableHead>
                                  <TableHead>Status</TableHead>
<TableHead>Aksi</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredRecipients
                                  .filter(r => r.wilayah === "Pantai Mentari")
                                  .filter(r => rtTab === "Semua" || r.rt === rtTab)
                                  .length > 0 ? (
                                  filteredRecipients
                                    .filter(r => r.wilayah === "Pantai Mentari")
                                    .filter(r => rtTab === "Semua" || r.rt === rtTab)
                                    .map((recipient) => (
                                    <TableRow key={recipient.id}>
                                      <TableCell className="font-medium text-xs">{recipient.id}</TableCell>
                                      <TableCell className="font-bold">{recipient.nama}</TableCell>
                                      <TableCell>{recipient.sektor}</TableCell>
                                      <TableCell>{recipient.noHp || '-'}</TableCell>
                                      <TableCell>{recipient.jenisKemasan}</TableCell>
                                      <TableCell>{recipient.jumlahPaket}</TableCell>
                                      <TableCell>
  <div className="flex items-center space-x-2">
    <Switch 
      checked={recipient.status === 'delivered'}
      onCheckedChange={() => handleToggleStatus(recipient.id, recipient.status)}
      className={recipient.status === 'delivered' ? "bg-green-500" : ""}
    />
    <span className={`text-xs font-medium ${recipient.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
      {recipient.status === 'delivered' ? 'Terkirim' : 'Pending'}
    </span>
  </div>
</TableCell>
<TableCell>
  <Button variant="ghost" size="icon" onClick={() => handleEditClick(recipient)}>
    <Edit2 className="h-4 w-4 text-blue-500" />
  </Button>
</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                      Belum ada data penerima untuk lokasi ini.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : wilayahTab === "Komplek AL" ? (
                    <Tabs defaultValue="Semua" className="w-full mb-4">
                      <div className="overflow-x-auto pb-2">
                        <TabsList className="min-w-max">
                          <TabsTrigger value="Semua">Semua Jalan</TabsTrigger>
                          <TabsTrigger value="Jl. Sadikin">Jl. Sadikin</TabsTrigger>
                          <TabsTrigger value="Jl. Heri Kasiyanto">Jl. Heri Kasiyanto</TabsTrigger>
                          <TabsTrigger value="Jl. Muhammad">Jl. Muhammad</TabsTrigger>
                          <TabsTrigger value="Jl. Isman">Jl. Isman</TabsTrigger>
                          <TabsTrigger value="Jl. Banuriyadi Kadir">Jl. Banuriyadi</TabsTrigger>
                          <TabsTrigger value="Jl. Mistar">Jl. Mistar</TabsTrigger>
                          <TabsTrigger value="Jl. Sahabudin">Jl. Sahabudin</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      {["Semua", "Jl. Sadikin", "Jl. Heri Kasiyanto", "Jl. Muhammad", "Jl. Isman", "Jl. Banuriyadi Kadir", "Jl. Mistar", "Jl. Sahabudin"].map(streetTab => (
                        <TabsContent key={streetTab} value={streetTab}>
                          <div className="overflow-x-auto border rounded-md">
                            <Table>
                              <TableHeader className="bg-gray-50">
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Nama</TableHead>
                                  <TableHead>Sektor/Jalan</TableHead>
                                  <TableHead>No. HP</TableHead>
                                  <TableHead>Kemasan</TableHead>
                                  <TableHead>Jumlah</TableHead>
                                  <TableHead>Status</TableHead>
<TableHead>Aksi</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredRecipients
                                  .filter(r => r.wilayah === "Komplek AL")
                                  .filter(r => streetTab === "Semua" || r.sektor === streetTab)
                                  .length > 0 ? (
                                  filteredRecipients
                                    .filter(r => r.wilayah === "Komplek AL")
                                    .filter(r => streetTab === "Semua" || r.sektor === streetTab)
                                    .map((recipient) => (
                                    <TableRow key={recipient.id}>
                                      <TableCell className="font-medium text-xs">{recipient.id}</TableCell>
                                      <TableCell className="font-bold">{recipient.nama || <span className="text-gray-400 italic">Belum diisi</span>}</TableCell>
                                      <TableCell>{recipient.sektor}</TableCell>
                                      <TableCell>{recipient.noHp || '-'}</TableCell>
                                      <TableCell>{recipient.jenisKemasan}</TableCell>
                                      <TableCell>{recipient.jumlahPaket}</TableCell>
                                      <TableCell>
  <div className="flex items-center space-x-2">
    <Switch 
      checked={recipient.status === 'delivered'}
      onCheckedChange={() => handleToggleStatus(recipient.id, recipient.status)}
      className={recipient.status === 'delivered' ? "bg-green-500" : ""}
    />
    <span className={`text-xs font-medium ${recipient.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
      {recipient.status === 'delivered' ? 'Terkirim' : 'Pending'}
    </span>
  </div>
</TableCell>
<TableCell>
  <Button variant="ghost" size="icon" onClick={() => handleEditClick(recipient)}>
    <Edit2 className="h-4 w-4 text-blue-500" />
  </Button>
</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                      Belum ada data penerima untuk lokasi ini. Silakan tambahkan secara manual.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="overflow-x-auto border rounded-md">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Sektor/Blok</TableHead>
                            <TableHead>No. HP</TableHead>
                            <TableHead>Kemasan</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Status</TableHead>
<TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecipients.filter(r => r.wilayah === wilayahTab).length > 0 ? (
                            filteredRecipients.filter(r => r.wilayah === wilayahTab).map((recipient) => (
                              <TableRow key={recipient.id}>
                                <TableCell className="font-medium text-xs">{recipient.id}</TableCell>
                                <TableCell className="font-bold">{recipient.nama}</TableCell>
                                <TableCell>{recipient.sektor}</TableCell>
                                <TableCell>{recipient.noHp || '-'}</TableCell>
                                <TableCell>{recipient.jenisKemasan}</TableCell>
                                <TableCell>{recipient.jumlahPaket}</TableCell>
                                <TableCell>
  <div className="flex items-center space-x-2">
    <Switch 
      checked={recipient.status === 'delivered'}
      onCheckedChange={() => handleToggleStatus(recipient.id, recipient.status)}
      className={recipient.status === 'delivered' ? "bg-green-500" : ""}
    />
    <span className={`text-xs font-medium ${recipient.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
      {recipient.status === 'delivered' ? 'Terkirim' : 'Pending'}
    </span>
  </div>
</TableCell>
<TableCell>
  <Button variant="ghost" size="icon" onClick={() => handleEditClick(recipient)}>
    <Edit2 className="h-4 w-4 text-blue-500" />
  </Button>
</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                Belum ada data penerima untuk lokasi ini.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Penerima</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nama">Nama</Label>
              <Input
                id="edit-nama"
                value={editFormData.nama}
                onChange={(e) => setEditFormData({...editFormData, nama: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-alamat">Alamat / Blok / Jalan</Label>
              <Input
                id="edit-alamat"
                value={editFormData.alamat}
                onChange={(e) => setEditFormData({...editFormData, alamat: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sektor">Sektor/Jalan Khusus</Label>
                <Input
                  id="edit-sektor"
                  value={editFormData.sektor}
                  onChange={(e) => setEditFormData({...editFormData, sektor: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rt">RT</Label>
                <Input
                  id="edit-rt"
                  value={editFormData.rt}
                  onChange={(e) => setEditFormData({...editFormData, rt: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-nohp">No. HP (Opsional)</Label>
              <Input
                id="edit-nohp"
                value={editFormData.noHp}
                onChange={(e) => setEditFormData({...editFormData, noHp: e.target.value})}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Recipients;
