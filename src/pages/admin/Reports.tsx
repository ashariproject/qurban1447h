import React, { useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { useQurban } from '@/contexts/QurbanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Beef, 
  Package, 
  Truck, 
  Printer, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { format } from 'date-fns';

const Reports = () => {
  const { shohibulList, hewanList, packagingData } = useQurban();
  const printRef = useRef<HTMLDivElement>(null);

  // 1. Shohibul Stats
  const totalShohibul = shohibulList.length;
  const shohibulSapiPatungan = shohibulList.filter(s => s.jenisQurban === 'sapi-patungan').length;
  const shohibulSapiMandiri = shohibulList.filter(s => s.jenisQurban === 'sapi-mandiri').length;
  const shohibulKambing = shohibulList.filter(s => s.jenisQurban.startsWith('kambing')).length;

  // 2. Animal Stats
  const totalSapi = hewanList.filter(h => h.jenis === 'sapi').length;
  const totalKambing = hewanList.filter(h => h.jenis === 'kambing').length;
  const totalHewan = totalSapi + totalKambing;

  const sapiDisembelih = hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima' && h.status !== 'daftar').length;
  const kambingDisembelih = hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima' && h.status !== 'daftar').length;
  const totalDisembelih = sapiDisembelih + kambingDisembelih;

  const sapiDipotong = hewanList.filter(h => h.jenis === 'sapi' && (h.status === 'dipotong' || h.status === 'distribusi')).length;
  const kambingDipotong = hewanList.filter(h => h.jenis === 'kambing' && (h.status === 'dipotong' || h.status === 'distribusi')).length;

  // 3. Packaging Stats
  const totalPacksProduced = (packagingData.sapiPacksInput || 0) + (packagingData.kambingPacksInput || 0);
  const totalPacksDistributed = (packagingData.sapiPacksOutput || 0) + (packagingData.kambingPacksOutput || 0);
  const totalPacksRemaining = totalPacksProduced - totalPacksDistributed;

  // 4. Distribution (Shohibul Daging)
  const totalDiterimaSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const totalDiterimaKambing = shohibulList.filter(s => !s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const totalTerkirim = totalDiterimaSapi + totalDiterimaKambing;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">LAPORAN KEGIATAN</h1>
            <p className="text-gray-500 text-xs">Infografis rangkuman eksekutif dan rekapitulasi data qurban 1447H.</p>
          </div>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2">
            <Printer className="h-4 w-4" />
            CETAK LAPORAN
          </Button>
        </div>

        {/* Infographics Printable Area */}
        <div ref={printRef} className="space-y-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
          
          {/* Print Header */}
          <div className="hidden print:flex items-center justify-between border-b pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-blue-900 tracking-tight uppercase">PANITIA QURBAN BERKAH 1447H</h2>
              <p className="text-xs text-gray-500 font-bold uppercase mt-1">Laporan Rangkuman Eksekutif & Realisasi Operasional</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Dicetak Tanggal</span>
              <span className="text-sm font-black text-gray-800">{format(new Date(), 'dd MMMM yyyy HH:mm')}</span>
            </div>
          </div>

          {/* 1. Rangkuman Utama (Key Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">Total Pengqurban</span>
                <span className="text-3xl font-black text-blue-900 leading-none">{totalShohibul}</span>
                <span className="text-[9px] text-blue-500 font-bold block mt-1 uppercase">Shohibul Terdaftar</span>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 text-blue-600 flex items-center justify-center rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider block">Total Hewan</span>
                <span className="text-3xl font-black text-orange-950 leading-none">{totalHewan}</span>
                <span className="text-[9px] text-orange-500 font-bold block mt-1 uppercase">Sapi: {totalSapi} | Kambing: {totalKambing}</span>
              </div>
              <div className="h-10 w-10 bg-orange-500/10 text-orange-600 flex items-center justify-center rounded-xl">
                <Beef className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Total Pack Daging</span>
                <span className="text-3xl font-black text-purple-900 leading-none">{totalPacksProduced}</span>
                <span className="text-[9px] text-purple-500 font-bold block mt-1 uppercase">Tersisa: {totalPacksRemaining} Pack</span>
              </div>
              <div className="h-10 w-10 bg-purple-500/10 text-purple-600 flex items-center justify-center rounded-xl">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Tingkat Penyaluran</span>
                <span className="text-3xl font-black text-emerald-900 leading-none">
                  {totalShohibul > 0 ? Math.round((totalTerkirim / totalShohibul) * 100) : 0}%
                </span>
                <span className="text-[9px] text-emerald-500 font-bold block mt-1 uppercase">{totalTerkirim} Shohibul Menerima</span>
              </div>
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 flex items-center justify-center rounded-xl">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* 2. Visual Progress Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Progres Tahap Operasional */}
            <Card className="border border-gray-100 shadow-none">
              <CardHeader className="border-b bg-gray-50/50 p-4">
                <CardTitle className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Kemajuan Proses Pemotongan Hewan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Sapi Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      HEWAN SAPI ({totalSapi} Ekor)
                    </span>
                    <span className="font-black text-orange-600">
                      {totalSapi > 0 ? Math.round((sapiDisembelih / totalSapi) * 100) : 0}% Disembelih
                    </span>
                  </div>
                  <Progress value={totalSapi > 0 ? (sapiDisembelih / totalSapi) * 100 : 0} className="h-3 bg-orange-50" />
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-gray-500 font-bold">
                    <div className="text-center bg-gray-50 py-1 rounded">TERDAFTAR: {totalSapi}</div>
                    <div className="text-center bg-orange-50/50 py-1 rounded text-orange-700">DISEMBELIH: {sapiDisembelih}</div>
                    <div className="text-center bg-emerald-50/50 py-1 rounded text-emerald-700">DIPOTONG/KULITI: {sapiDipotong}</div>
                  </div>
                </div>

                {/* Kambing Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      HEWAN KAMBING ({totalKambing} Ekor)
                    </span>
                    <span className="font-black text-green-600">
                      {totalKambing > 0 ? Math.round((kambingDisembelih / totalKambing) * 100) : 0}% Disembelih
                    </span>
                  </div>
                  <Progress value={totalKambing > 0 ? (kambingDisembelih / totalKambing) * 100 : 0} className="h-3 bg-green-50" />
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-gray-500 font-bold">
                    <div className="text-center bg-gray-50 py-1 rounded">TERDAFTAR: {totalKambing}</div>
                    <div className="text-center bg-orange-50/50 py-1 rounded text-orange-700">DISEMBELIH: {kambingDisembelih}</div>
                    <div className="text-center bg-emerald-50/50 py-1 rounded text-emerald-700">DIPOTONG/KULITI: {kambingDipotong}</div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Progres Distribusi & Logistik */}
            <Card className="border border-gray-100 shadow-none">
              <CardHeader className="border-b bg-gray-50/50 p-4">
                <CardTitle className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  Realisasi Logistik & Distribusi Paket
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Pack Daging Distribution */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      PACK KELUAR ({totalPacksDistributed} / {totalPacksProduced} Pack)
                    </span>
                    <span className="font-black text-purple-600">
                      {totalPacksProduced > 0 ? Math.round((totalPacksDistributed / totalPacksProduced) * 100) : 0}% Keluar
                    </span>
                  </div>
                  <Progress value={totalPacksProduced > 0 ? (totalPacksDistributed / totalPacksProduced) * 100 : 0} className="h-3 bg-purple-50" />
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-gray-500 font-bold">
                    <div className="text-center bg-gray-50 py-1 rounded">PRODUKSI: {totalPacksProduced}</div>
                    <div className="text-center bg-purple-50/50 py-1 rounded text-purple-700">DIKIRIM: {totalPacksDistributed}</div>
                    <div className="text-center bg-blue-50/50 py-1 rounded text-blue-700">SISA STOK: {totalPacksRemaining}</div>
                  </div>
                </div>

                {/* Shohibul Penerimaan */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      PENYALURAN SHOHIBUL ({totalTerkirim} / {totalShohibul} Shohibul)
                    </span>
                    <span className="font-black text-emerald-600">
                      {totalShohibul > 0 ? Math.round((totalTerkirim / totalShohibul) * 100) : 0}% Diterima
                    </span>
                  </div>
                  <Progress value={totalShohibul > 0 ? (totalTerkirim / totalShohibul) * 100 : 0} className="h-3 bg-emerald-50" />
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-gray-500 font-bold">
                    <div className="text-center bg-emerald-50/50 py-1 rounded text-emerald-700">SUDAH MENERIMA: {totalTerkirim}</div>
                    <div className="text-center bg-red-50/50 py-1 rounded text-red-700">BELUM MENERIMA: {totalShohibul - totalTerkirim}</div>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* 3. Detail Rincian Operasional & Tabel rekap */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              RINCIAN DATA REKAPITULASI
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Rekap Shohibul */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Shohibul Terdaftar</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-600">
                  <li className="flex justify-between border-b pb-1">
                    <span>Sapi Patungan (Kolektif):</span>
                    <span className="text-gray-800 font-black">{shohibulSapiPatungan} Orang</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Sapi Mandiri:</span>
                    <span className="text-gray-800 font-black">{shohibulSapiMandiri} Orang</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Kambing (Mandiri/Titip Beli):</span>
                    <span className="text-gray-800 font-black">{shohibulKambing} Orang</span>
                  </li>
                  <li className="flex justify-between text-blue-700 font-black">
                    <span>Total Pengqurban:</span>
                    <span>{totalShohibul} Orang</span>
                  </li>
                </ul>
              </div>

              {/* Rekap Hewan Qurban */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Hewan Qurban</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-600">
                  <li className="flex justify-between border-b pb-1">
                    <span>Hewan Sapi Terdaftar:</span>
                    <span className="text-gray-800 font-black">{totalSapi} Ekor</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Hewan Kambing Terdaftar:</span>
                    <span className="text-gray-800 font-black">{totalKambing} Ekor</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Hewan Selesai Disembelih:</span>
                    <span className="text-emerald-700 font-black">{totalDisembelih} Ekor</span>
                  </li>
                  <li className="flex justify-between text-blue-700 font-black">
                    <span>Total Hewan Qurban:</span>
                    <span>{totalHewan} Ekor</span>
                  </li>
                </ul>
              </div>

              {/* Rekap Logistik & Daging */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Realisasi Pengemasan</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-600">
                  <li className="flex justify-between border-b pb-1">
                    <span>Total Target Produksi:</span>
                    <span className="text-gray-800 font-black">{totalPacksProduced} Pack</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Daging Didistribusikan:</span>
                    <span className="text-emerald-700 font-black">{totalPacksDistributed} Pack</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Sisa Stok di Posko:</span>
                    <span className="text-orange-700 font-black">{totalPacksRemaining} Pack</span>
                  </li>
                  <li className="flex justify-between text-blue-700 font-black">
                    <span>Status Stok:</span>
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {totalPacksRemaining === 0 ? "Tersalurkan Semua" : `${totalPacksRemaining} Pack Ready`}
                    </span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* 4. Footer Tanda Tangan (Khusus Print) */}
          <div className="hidden print:grid grid-cols-2 pt-16 gap-8 text-center text-xs font-bold text-gray-600">
            <div>
              <p>Mengetahui,</p>
              <p className="mt-1">Ketua Panitia Qurban 1447H</p>
              <div className="h-16" />
              <p className="border-t w-48 mx-auto pt-1 text-gray-800 font-black">H. Ashari</p>
            </div>
            <div>
              <p>Penanggung Jawab Data,</p>
              <p className="mt-1">Petugas Administrasi</p>
              <div className="h-16" />
              <p className="border-t w-48 mx-auto pt-1 text-gray-800 font-black">Staff Admin Panitia</p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Reports;
