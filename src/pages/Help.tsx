import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, KeyRound, BookOpen, ShieldAlert } from 'lucide-react';

const credentials = [
  { role: 'Admin', username: 'admin', password: 'admin123', desc: 'Akses penuh seluruh fitur, manajemen pengguna, monitoring, laporan, & reset data.' },
  { role: 'Petugas Shohibul', username: 'shohibul', password: 'shohibul123', desc: 'Input & update data shohibul, pemetaan lokasi, validasi pembayaran.' },
  { role: 'Petugas Hewan', username: 'hewan', password: 'hewan123', desc: 'Input data hewan, update status (diterima → disembelih → dipotong), foto & QR.' },
  { role: 'Petugas Pengemasan', username: 'pengemasan', password: 'pengemasan123', desc: 'Input hasil pengemasan paket sapi/kambing, status siap distribusi.' },
  { role: 'Petugas Distribusi', username: 'distribusi', password: 'distribusi123', desc: 'Input data penerima, rute distribusi, bukti terima.' },
  { role: 'Panitia', username: 'panitia', password: 'panitia123', desc: 'Akses monitoring terpusat: pantau progres hewan, pengemasan, distribusi, shohibul, dan status pengiriman.' },
];

const guides = [
  {
    q: '1. Cara Login & Memilih Peran',
    a: 'Gunakan username & password sesuai peran pada tabel di bawah. Admin dapat berpindah peran melalui sidebar bagian "Peran" untuk melihat tampilan tiap petugas.',
  },
  {
    q: '2. Alur Pendataan Shohibul',
    a: 'Buka menu Data Shohibul → klik Tambah → isi nama, kontak, alamat, jenis qurban (sapi/kambing). Saat shohibul disimpan, sistem otomatis membuat data hewan dengan kode unik (SP001, KM001, dst).',
  },
  {
    q: '3. Foto & QR Code Hewan Qurban',
    a: 'Buka menu "Foto & QR Hewan" (Petugas Hewan). Pilih hewan → upload foto → QR code otomatis dibuat. QR code bila di-scan akan membuka halaman publik detail hewan & shohibul.',
  },
  {
    q: '4. Pengemasan Daging',
    a: 'Petugas Pengemasan menginput jumlah paket sapi & kambing beserta estimasi berat. Status berubah menjadi "Siap Distribusi" setelah dikemas.',
  },
  {
    q: '5. Distribusi',
    a: 'Petugas Distribusi menginput data penerima (nama, alamat, kluster wilayah), memilih rute, lalu menandai status pengiriman dengan bukti foto/tanda tangan.',
  },
  {
    q: '6. Sinkronisasi Google Sheets',
    a: 'Admin membuka Integration → Google Sheets, pasang API Key & Spreadsheet ID, lalu klik Sync. Data shohibul & distribusi akan tersinkron ke Google Sheet.',
  },
  {
    q: '7. Reset Data (Admin)',
    a: 'Tombol "Reset Data" di sidebar bagian bawah hanya tersedia untuk Admin. Tindakan ini menghapus seluruh data lokal dan mengembalikan ke kondisi awal.',
  },
];

const Help = () => {
  return (
    <Layout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-qurban-600" />
            Bantuan & Panduan
          </h1>
          <p className="text-muted-foreground">
            Panduan penggunaan Sistem Manajemen Qurban Masjid As Sakinah Pantai Mentari.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Akun Login Petugas & Admin
            </CardTitle>
            <CardDescription>
              Gunakan kredensial berikut untuk masuk ke sistem sesuai peran masing-masing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peran</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Deskripsi Akses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map((c) => (
                    <TableRow key={c.username}>
                      <TableCell>
                        <Badge variant={c.role === 'Admin' ? 'default' : 'secondary'}>
                          {c.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{c.username}</TableCell>
                      <TableCell className="font-mono">{c.password}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                <strong>Catatan keamanan:</strong> Kredensial ini bersifat default untuk demo.
                Ganti password masing-masing akun melalui menu Pengaturan setelah login pertama.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Panduan Penggunaan
            </CardTitle>
            <CardDescription>
              Langkah-langkah penggunaan sistem dari registrasi hingga distribusi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {guides.map((g, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{g.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{g.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Butuh bantuan lebih lanjut?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Hubungi pengurus Masjid As Sakinah Pantai Mentari untuk bantuan teknis.</p>
            <p>Website: <a className="text-qurban-600 underline" href="http://assakinahpantaimentari.org" target="_blank" rel="noreferrer">assakinahpantaimentari.org</a></p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;
