import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Beef, Package, Users, Truck, ArrowRight, Activity, Camera } from 'lucide-react';
import { useQurban } from '@/contexts/QurbanContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PanitiaDashboard = () => {
  const { hewanList, packagingData, shohibulList } = useQurban();

  // 1. DYNAMIC CALCULATIONS - HEWAN
  const totalSapi = hewanList.filter(h => h.jenis === 'sapi').length;
  const totalKambing = hewanList.filter(h => h.jenis === 'kambing').length;
  const totalHewan = totalSapi + totalKambing;

  const sapiDisembelih = hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima' && h.status !== 'daftar').length;
  const kambingDisembelih = hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima' && h.status !== 'daftar').length;
  const totalDisembelih = sapiDisembelih + kambingDisembelih;

  const totalFotoHewan = hewanList.reduce((acc, curr) => acc + (curr.fotoUrls?.length || 0), 0);

  // 2. DYNAMIC CALCULATIONS - PACKAGING
  const totalPacksInput = (packagingData.sapiPacksInput || 0) + (packagingData.kambingPacksInput || 0);
  const totalPacksOutput = (packagingData.sapiPacksOutput || 0) + (packagingData.kambingPacksOutput || 0);

  // 3. DYNAMIC CALCULATIONS - SHOHIBUL & DISTRIBUSI
  const totalShohibul = shohibulList.length;
  
  // Calculate delivery stats from shohibul list
  const totalDiterimaSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const totalDiterimaKambing = shohibulList.filter(s => !s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const totalTerkirim = totalDiterimaSapi + totalDiterimaKambing;

  // Resolve donor names and groups for each animal
  const getAnimalDonorDetails = (animal: typeof hewanList[0]) => {
    const representative = shohibulList.find(s => s.id === animal.shohibulId);
    if (!representative) {
      return {
        label: 'HAMBA ALLAH',
        isPatungan: false,
        names: ['Hamba Allah']
      };
    }

    if (representative.jenisQurban === 'sapi-patungan') {
      const patunganShohibuls = shohibulList
        .filter(s => s.jenisQurban === 'sapi-patungan')
        .sort((a, b) => {
          const dateCompare = (a.tanggalDaftar || '').localeCompare(b.tanggalDaftar || '');
          if (dateCompare !== 0) return dateCompare;
          return a.nama.localeCompare(b.nama);
        });
      
      const match = animal.kode.match(/\d+/);
      const cowNumber = match ? parseInt(match[0], 10) : 1;
      const groupIdx = (cowNumber - 1) % 5;
      
      const start = groupIdx * 7;
      const group = patunganShohibuls.slice(start, start + 7);
      return {
        label: 'SAPI PATUNGAN/KOLEKTIF',
        isPatungan: true,
        names: group.map(s => s.nama)
      };
    }

    return {
      label: representative.nama,
      isPatungan: false,
      names: [representative.nama]
    };
  };

  // Sort animal list: Sapi first (S-01, S-02...), then Kambing (K-01, K-02...)
  const sortedHewanList = [...hewanList].sort((a, b) => {
    if (a.jenis !== b.jenis) {
      return a.jenis === 'sapi' ? -1 : 1;
    }
    const numA = parseInt(a.kode.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.kode.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter flex items-center gap-3">
              MONITORING PANITIA QURBAN
              <Activity className="h-6 w-6 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-blue-100 font-medium max-w-2xl">
              Selamat datang di portal khusus monitoring panitia. Pantau kemajuan seluruh tahapan operasional ibadah qurban 1447H secara real-time.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
            <Users size={250} />
          </div>
        </div>

        {/* 3 Main Sections of Panitia monitoring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Section 1: Hewan, Status & Foto */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-white flex flex-col justify-between overflow-hidden group">
            <div>
              <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-orange-500/10 pb-4">
                <CardTitle className="text-base font-black text-gray-800 flex items-center gap-2 tracking-wide uppercase">
                  <Beef className="h-5 w-5 text-orange-600" />
                  Hewan & Status Pemotongan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">TOTAL HEWAN</span>
                    <span className="text-3xl font-black text-orange-600">{totalHewan}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">S:{totalSapi} | K:{totalKambing}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">DISEMBELIH</span>
                    <span className="text-3xl font-black text-emerald-600">{totalDisembelih}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">Progres: {totalHewan > 0 ? Math.round((totalDisembelih / totalHewan) * 100) : 0}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                    <span>Progres Penyembelihan Hewan</span>
                    <span>{totalDisembelih}/{totalHewan}</span>
                  </div>
                  <Progress value={totalHewan > 0 ? (totalDisembelih / totalHewan) * 100 : 0} className="h-2 bg-orange-100" />
                </div>

                <div className="flex items-center justify-between bg-purple-50/30 border border-purple-100/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-bold text-gray-700">FOTO DOKUMENTASI</span>
                  </div>
                  <span className="text-sm font-black text-purple-700">{totalFotoHewan} Lembar</span>
                </div>
              </CardContent>
            </div>
            <div className="p-4 border-t bg-gray-50/50">
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold" size="sm">
                <Link to="/animal/data" className="flex items-center justify-center gap-2">
                  Lihat Detail & Foto Hewan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Section 2: Packing & Distribusi */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-white flex flex-col justify-between overflow-hidden group">
            <div>
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-blue-500/10 pb-4">
                <CardTitle className="text-base font-black text-gray-800 flex items-center gap-2 tracking-wide uppercase">
                  <Package className="h-5 w-5 text-blue-600" />
                  Pengemasan & Distribusi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">PACK DIHASILKAN</span>
                    <span className="text-3xl font-black text-blue-600">{totalPacksInput}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">Pack Dihasilkan</span>
                  </div>
                  <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100/50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">PACK DISTRIBUSI</span>
                    <span className="text-3xl font-black text-purple-600">{totalPacksOutput}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">Sisa Stok: {totalPacksInput - totalPacksOutput} Pack</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                    <span>Progres Distribusi Paket</span>
                    <span>{totalPacksInput > 0 ? Math.round((totalPacksOutput / totalPacksInput) * 100) : 0}%</span>
                  </div>
                  <Progress value={totalPacksInput > 0 ? (totalPacksOutput / totalPacksInput) * 100 : 0} className="h-2 bg-blue-100" />
                </div>

                <div className="flex items-center justify-between bg-emerald-50/30 border border-emerald-100/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">REALISASI DISTRIBUSI</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">{totalTerkirim} Terkirim</span>
                </div>
              </CardContent>
            </div>
            <div className="p-4 border-t bg-gray-50/50">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold" size="sm">
                <Link to="/packaging/data" className="flex items-center justify-center gap-2">
                  Lihat Detail Pengemasan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Section 3: Shohibul & Stats Pengiriman */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-white flex flex-col justify-between overflow-hidden group">
            <div>
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-b border-emerald-500/10 pb-4">
                <CardTitle className="text-base font-black text-gray-800 flex items-center gap-2 tracking-wide uppercase">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Shohibul & Status Kirim
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">TOTAL SHOHIBUL</span>
                    <span className="text-3xl font-black text-emerald-600">{totalShohibul}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">Orang Terdaftar</span>
                  </div>
                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">STATUS PENGIRIMAN</span>
                    <span className="text-3xl font-black text-indigo-600">{totalTerkirim}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">Diterima Shohibul</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                    <span>Persentase Diterima Shohibul</span>
                    <span>{totalShohibul > 0 ? Math.round((totalTerkirim / totalShohibul) * 100) : 0}%</span>
                  </div>
                  <Progress value={totalShohibul > 0 ? (totalTerkirim / totalShohibul) * 100 : 0} className="h-2 bg-emerald-100" />
                </div>

                <div className="flex items-center justify-between bg-yellow-50/30 border border-yellow-100/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-yellow-600 animate-bounce" />
                    <span className="text-xs font-bold text-gray-700">BELUM TERKIRIM</span>
                  </div>
                  <span className="text-sm font-black text-yellow-700">{totalShohibul - totalTerkirim} Shohibul</span>
                </div>
              </CardContent>
            </div>
            <div className="p-4 border-t bg-gray-50/50">
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" size="sm">
                <Link to="/shohibul/data" className="flex items-center justify-center gap-2">
                  Lihat Detail Shohibul
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

        </div>

        {/* GALERI DOKUMENTASI HEWAN & SHOHIBUL */}
        <div className="space-y-4 pt-4">
          <div className="border-b pb-2">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Galeri Dokumentasi Hewan & Pengqurban
            </h2>
            <p className="text-xs text-gray-500 font-medium">Foto dokumentasi real-time dari posko penyembelihan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedHewanList.map((animal) => {
              const { label, isPatungan, names } = getAnimalDonorDetails(animal);
              const hasPhotos = animal.fotoUrls && animal.fotoUrls.length > 0;
              const imageUrl = hasPhotos 
                ? animal.fotoUrls[0] 
                : (animal.jenis === 'sapi' 
                  ? "/images/sapi_bali_lokal.png" 
                  : "/images/kambing_lokal.png"
                );

              return (
                <Card key={animal.id} className="border-none shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col bg-white group">
                  {/* Thumbnail Image (agak besar) */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Dokumentasi ${animal.kode}`} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-fade-in ${!hasPhotos ? 'opacity-40' : ''}`}
                    />
                    
                    {/* Animal Code Badge (lebih besar) */}
                    <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xl font-black tracking-wider shadow-md border border-white/20">
                      {animal.kode}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      animal.status === 'dipotong' 
                        ? 'bg-emerald-600 text-white' 
                        : animal.status === 'disembelih' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-blue-600 text-white'
                    }`}>
                      {animal.status}
                    </div>

                    {/* Animal Type Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">
                      {animal.jenis.toUpperCase()}
                    </div>
                  </div>

                  {/* Donor Names (Pengqurban) */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="border-b pb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Pengqurban</span>
                        <h4 className="font-black text-gray-800 text-sm mt-0.5 truncate" title={label}>
                          {label}
                        </h4>
                      </div>

                      {isPatungan && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Daftar Lengkap (7 Orang)</span>
                          <div className="max-h-24 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                            {names.map((name, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-qurban-500 shrink-0" />
                                <span className="truncate">{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>Bobot Hidup:</span>
                      <span className="text-gray-800 text-xs font-black">{animal.bobot ? `${Math.round(animal.bobot)} kg` : '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default PanitiaDashboard;
