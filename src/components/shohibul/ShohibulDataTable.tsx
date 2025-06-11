
import React, { useState } from 'react';
import { ShohibulData } from '@/pages/shohibul/Data';
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
import ShohibulEditDialog from './ShohibulEditDialog';
import { Edit, Trash2, Filter } from 'lucide-react';

interface ShohibulDataTableProps {
  data: ShohibulData[];
  onEdit: (id: string, updatedData: Partial<ShohibulData>) => void;
  onDelete: (id: string) => void;
}

const ShohibulDataTable: React.FC<ShohibulDataTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<ShohibulData | null>(null);

  const filteredData = data.filter(item => {
    const matchesJenis = filterJenis === 'all' || item.jenisQurban === filterJenis;
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.noTelepon.includes(searchTerm);
    return matchesJenis && matchesSearch;
  });

  const handleEdit = (item: ShohibulData) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (updatedData: Partial<ShohibulData>) => {
    if (editingItem) {
      onEdit(editingItem.id, updatedData);
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      onDelete(id);
    }
  };

  const getJenisLabel = (jenis: string) => {
    switch (jenis) {
      case 'sapi-mandiri':
        return 'Sapi Mandiri';
      case 'kambing-mandiri':
        return 'Kambing Mandiri';
      default:
        return jenis;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Data Shohibul Qurban
        </CardTitle>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Cari nama, alamat, atau nomor telepon..."
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
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {data.length === 0 
              ? 'Belum ada data shohibul. Tambahkan data baru menggunakan form di atas.'
              : 'Tidak ada data yang sesuai dengan filter atau pencarian.'
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead>Jenis Qurban</TableHead>
                <TableHead>Jumlah Hewan</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                  <TableCell>{item.noTelepon}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.jenisQurban === 'sapi-mandiri' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getJenisLabel(item.jenisQurban)}
                    </span>
                  </TableCell>
                  <TableCell>{item.jumlahHewan}</TableCell>
                  <TableCell>{new Date(item.tanggalDaftar).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {editingItem && (
          <ShohibulEditDialog
            item={editingItem}
            onSave={handleSaveEdit}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ShohibulDataTable;
