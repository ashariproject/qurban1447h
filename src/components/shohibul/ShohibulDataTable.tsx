
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
import { Badge } from '@/components/ui/badge';
import ShohibulEditDialog from './ShohibulEditDialog';
import { Edit, Trash2, Filter, FileText, Share2, Printer, Phone, Files, Loader2, AlertTriangle } from 'lucide-react';
import { generateCertificate, generateAllCertificates, downloadPDF } from '@/utils/certificateGenerator';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generateProgress, setGenerateProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const handlePrintCertificate = async (shohibul: ShohibulData) => {
    try {
      toast({ title: "Generating Certificate...", description: "Mohon tunggu sebentar." });
      const pdfBytes = await generateCertificate(shohibul.nama, shohibul.jenisQurban);
      downloadPDF(pdfBytes, `Sertifikat_Qurban_${shohibul.nama.replace(/\s+/g, '_')}.pdf`);
      toast({ title: "Berhasil!", description: "Sertifikat telah diunduh." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat membuat sertifikat." });
    }
  };

  // ── Generate semua sertifikat sekaligus ──────────────────────
  const handleGenerateAllCertificates = async () => {
    const eligible = data.filter(s => s.nama && s.nama !== 'Hamba Allah');
    if (eligible.length === 0) {
      toast({ variant: 'destructive', title: 'Tidak ada data', description: 'Tidak ada shohibul yang bisa dicetak sertifikatnya.' });
      return;
    }

    setIsGeneratingAll(true);
    setGenerateProgress({ current: 0, total: eligible.length });

    try {
      toast({
        title: '⏳ Membuat Sertifikat...',
        description: `Memproses ${eligible.length} sertifikat, mohon tunggu.`,
      });

      const pdfBytes = await generateAllCertificates(
        eligible.map(s => ({ nama: s.nama, jenisQurban: s.jenisQurban })),
        (current, total) => setGenerateProgress({ current, total })
      );

      const today = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
      downloadPDF(pdfBytes, `Semua_Sertifikat_Qurban_1447H_${today}.pdf`);

      toast({
        title: '✅ Berhasil!',
        description: `${eligible.length} sertifikat berhasil digabung dan diunduh sebagai 1 file PDF.`,
      });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Gagal', description: 'Terjadi kesalahan saat membuat sertifikat gabungan.' });
    } finally {
      setIsGeneratingAll(false);
      setGenerateProgress({ current: 0, total: 0 });
    }
  };

  const handleSendCertificateWA = async (shohibul: ShohibulData) => {
    try {
      // First generate/download so they have it
      const pdfBytes = await generateCertificate(shohibul.nama, shohibul.jenisQurban);
      downloadPDF(pdfBytes, `Sertifikat_Qurban_${shohibul.nama.replace(/\s+/g, '_')}.pdf`);

      const message = `Assalamu'alaikum Bapak/Ibu *${shohibul.nama}*,%0A%0A` +
        `Terima kasih telah menyalurkan hewan Qurban melalui *Masjid As Sakinah Pantai Mentari*.%0A%0A` +
        `Berikut kami lampirkan *Sertifikat Qurban 1447H* sebagai bentuk apresiasi dan tanda terima dari panitia.%0A%0A` +
        `_Jazakumullahu Khairan Katsiran._`;
      
      const waLink = `https://wa.me/${shohibul.noTelepon.replace(/^0/, '62')}?text=${message}`;
      window.open(waLink, '_blank');
      
      toast({ title: "WhatsApp Dibuka", description: "Silakan lampirkan file sertifikat yang baru saja diunduh." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat memproses pendaftaran." });
    }
  };

  const filteredData = data.filter(item => {
    const matchesJenis = filterJenis === 'all' || item.jenisQurban === filterJenis;
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.noTelepon.includes(searchTerm);
    return matchesJenis && matchesSearch;
  });

  // Urutan tetap berdasarkan tanggal daftar (pertama masuk = nomor 1, tidak bisa diubah)
  const sortedAndFilteredData = [...filteredData].sort((a, b) =>
    new Date(a.tanggalDaftar).getTime() - new Date(b.tanggalDaftar).getTime()
  );

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
      case 'kambing-titip-beli':
        return 'Kambing (Titip Beli)';
      case 'sapi-patungan':
        return 'Sapi Patungan';
      default:
        return jenis;
    }
  };

  const getPembayaranBadge = (pembayaran: ShohibulData['pembayaran']) => {
    const percentage = (pembayaran.jumlahDibayar / pembayaran.totalBiaya) * 100;
    
    switch (pembayaran.status) {
      case 'lunas-cash':
        return <Badge className="bg-green-100 text-green-800">Lunas - Cash</Badge>;
      case 'lunas-transfer':
        return <Badge className="bg-blue-100 text-blue-800">Lunas - Transfer</Badge>;
      case 'cicil':
        return <Badge className="bg-yellow-100 text-yellow-800">Cicil ({percentage.toFixed(0)}%)</Badge>;
      case 'belum-bayar':
        return <Badge className="bg-red-100 text-red-800">Belum Bayar</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // helper: cek validitas nomor HP
  const isPhoneValid = (phone: string) => {
    if (!phone || phone === '0' || phone === '-' || phone === '.') return false;
    if (phone.length < 10) return false;
    return /^(0|62|\+62)[0-9]+$/.test(phone);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Shohibul Qurban
            <Badge variant="secondary" className="ml-1 font-bold">{data.length} Orang</Badge>
          </CardTitle>

          {/* ── Tombol Generate Semua Sertifikat ── */}
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={handleGenerateAllCertificates}
              disabled={isGeneratingAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md gap-2 h-10"
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses {generateProgress.current}/{generateProgress.total}...
                </>
              ) : (
                <>
                  <Files className="h-4 w-4" />
                  Generate Semua Sertifikat (1 PDF)
                </>
              )}
            </Button>
            {isGeneratingAll && generateProgress.total > 0 && (
              <div className="w-full max-w-[280px]">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(generateProgress.current / generateProgress.total) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 text-right mt-0.5">
                  {Math.round((generateProgress.current / generateProgress.total) * 100)}% selesai
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
          <div className="flex-1 w-full">
            <Input
              placeholder="Cari nama, alamat, atau nomor telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterJenis} onValueChange={setFilterJenis}>
              <SelectTrigger className="w-[180px]">
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
        </div>
      </CardHeader>
      <CardContent>
        {sortedAndFilteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {data.length === 0 
              ? 'Belum ada data shohibul. Tambahkan data baru menggunakan form di atas.'
              : 'Tidak ada data yang sesuai dengan filter atau pencarian.'
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Jenis Qurban</TableHead>
                  <TableHead>Jumlah Hewan</TableHead>
                  <TableHead>Status Pembayaran</TableHead>
                  <TableHead>Biaya</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>{item.alamat}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {!isPhoneValid(item.noTelepon) ? (
                          <span className="flex items-center gap-1 text-red-600 font-semibold text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            {item.noTelepon || '-'}
                          </span>
                        ) : (
                          <span className="text-sm">{item.noTelepon}</span>
                        )}
                      </div>
                    </TableCell>
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
                    <TableCell>{getPembayaranBadge(item.pembayaran)}</TableCell>
                    <TableCell className="text-sm">
                      <div>{formatCurrency(item.pembayaran.jumlahDibayar)}</div>
                      <div className="text-gray-500">dari {formatCurrency(item.pembayaran.totalBiaya)}</div>
                    </TableCell>
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

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200">
                              <FileText className="h-4 w-4 mr-1" />
                              Sertifikat
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Opsi Sertifikat</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrintCertificate(item)} className="cursor-pointer">
                              <Printer className="mr-2 h-4 w-4" />
                              <span>Cetak / Unduh PDF</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendCertificateWA(item)} className="cursor-pointer">
                              <Share2 className="mr-2 h-4 w-4 text-green-600" />
                              <span>Kirim via WhatsApp</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
