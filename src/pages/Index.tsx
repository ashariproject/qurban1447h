
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Beef, Package, Info, Heart, ShieldCheck, Calendar, Truck, Activity, Camera } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useQurban } from '@/contexts/QurbanContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, logout } = useAuth();
  const { shohibulList, animalData, hewanList, packagingData, distributionList } = useQurban();

  // Calculations for live monitoring
  const shohibulSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi')).length;
  const shohibulKambing = shohibulList.filter(s => s.jenisQurban.startsWith('kambing')).length;
  
  const diterimaSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const diterimaKambing = shohibulList.filter(s => !s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;

  const finalDistributionData = distributionList.map(item => {
    if (item.id === 'shohibul-sapi') {
      return { ...item, current: diterimaSapi, total: shohibulSapi };
    }
    if (item.id === 'shohibul-kambing') {
      return { ...item, current: diterimaKambing, total: diterimaKambing };
    }
    return item;
  }).sort((a, b) => {
    const orderMap: Record<string, number> = {
      'pantai-mentari': 1,
      'kompleks-al': 2,
      'warga-lain': 3,
      'shohibul-sapi': 4,
      'shohibul-kambing': 5
    };
    return (orderMap[a.id] || 99) - (orderMap[b.id] || 99);
  });

  // Data AKTUAL dari hewanList (sama dengan tampilan halaman Animal & Panitia)
  const hewanSapiAktual = hewanList.filter(h => h.jenis === 'sapi').length;
  const hewanKambingAktual = hewanList.filter(h => h.jenis === 'kambing').length;

  const totalDipotong = hewanList.filter(h => h.status === 'dipotong').length;
  const totalPacksPackaging = packagingData.sapiPacksOutput + packagingData.kambingPacksOutput;
  const totalPacksDistributed = finalDistributionData.reduce((acc, curr) => acc + curr.current, 0);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Header Section - Compact */}
        <header className="mb-4 relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-md border border-green-100">
                <img 
                  src="/images/logo.png" 
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">QurbanKu Dashboard</h1>
                <p className="text-[10px] text-gray-500">Masjid As Sakinah Pantai Mentari</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 font-bold h-7 text-xs">
                    <Link to="/admin">MENU ADMIN</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium h-7 text-xs">
                    LOGOUT
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 h-7 text-xs">
                  <Link to="/login">LOGIN PETUGAS</Link>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
              1447H / 2026
            </Badge>
            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium bg-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/50">
              <Calendar className="h-3 w-3 text-blue-500" />
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Rekapitulasi Perolehan Hewan</h2>
        </header>

        {/* Simple Perolehan Summary - Real Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-md">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-[10px] font-medium uppercase tracking-wider mb-0.5">Perolehan Sapi</p>
                <h3 className="text-3xl font-bold">{animalData.totalSapi} <span className="text-sm font-normal text-blue-200">Ekor</span></h3>
                <p className="text-blue-200 text-[10px] mt-0.5">Diterima di posko: <span className="font-bold text-white">{hewanSapiAktual} ekor</span></p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <Beef className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-none shadow-md">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-green-100 text-[10px] font-medium uppercase tracking-wider mb-0.5">Perolehan Kambing</p>
                <h3 className="text-3xl font-bold">{animalData.totalKambing} <span className="text-sm font-normal text-green-200">Ekor</span></h3>
                <p className="text-green-200 text-[10px] mt-0.5">Diterima di posko: <span className="font-bold text-white">{hewanKambingAktual} ekor</span></p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <div className="h-6 w-6 flex items-center justify-center font-bold text-xl">🐐</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Operational Monitoring Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-1.5 bg-emerald-600 rounded-full" />
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Monitoring Progress Operasional (Live)</h2>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Selesai Dipotong */}
            <Card className="border-none shadow-md bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Beef className="h-16 w-16" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-amber-100 text-[10px] font-bold uppercase tracking-wider">Hewan Selesai Dipotong</p>
                  <h3 className="text-3xl font-black">{totalDipotong} <span className="text-[10px] font-bold">EKOR</span></h3>
                  <div className="pt-1 text-[10px] font-semibold text-amber-50">
                    Dari total {hewanList.length} ekor hewan diterima
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terpackaging */}
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Package className="h-16 w-16" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Pack yang Terpackaging</p>
                  <h3 className="text-3xl font-black">{totalPacksPackaging} <span className="text-[10px] font-bold">PACK</span></h3>
                  <div className="pt-1 text-[10px] font-semibold text-blue-50">
                    Siap untuk didistribusikan ke penerima
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terdistribusi */}
            <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Truck className="h-16 w-16" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Pack yang Terdistribusi</p>
                  <h3 className="text-3xl font-black">{totalPacksDistributed} <span className="text-[10px] font-bold">PACK</span></h3>
                  <div className="pt-1 text-[10px] font-semibold text-emerald-50">
                    Penyaluran daging qurban real-time
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Public Rekap Table Section - Mirrored from Physical Board */}
        <section id="rekap-data" className="relative mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-1.5 bg-blue-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-900">Daftar Shohibul Qurban</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sapi Mandiri Section */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
              <div className="bg-orange-600 p-3 text-white font-bold text-center flex items-center justify-center gap-2">
                <Beef className="h-5 w-5" />
                SAPI MANDIRI
              </div>
              <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="h-8">
                        <TableHead className="w-12 text-xs py-1">NO</TableHead>
                        <TableHead className="text-xs py-1">NAMA PENGQURBAN</TableHead>
                        <TableHead className="text-xs py-1">ALAMAT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shohibulList.filter(s => s.jenisQurban === 'sapi-mandiri').length > 0 ? (
                        shohibulList.filter(s => s.jenisQurban === 'sapi-mandiri').map((s, idx) => (
                          <TableRow key={s.id} className="hover:bg-gray-50/50 border-b border-gray-100 h-7">
                            <TableCell className="py-1 px-2 text-xs">{idx + 1}</TableCell>
                            <TableCell className="py-1 px-2 font-semibold text-xs">{s.nama}</TableCell>
                            <TableCell className="py-1 px-2 text-[10px] text-gray-500 truncate max-w-[100px]">{s.alamat}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-2 text-gray-400 italic text-xs">Belum ada data</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>

            {/* Sapi Kolektif Section */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
              <div className="bg-blue-600 p-2 text-white font-bold text-center flex items-center justify-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                SAPI KOLEKTIF (PATUNGAN)
              </div>
              <CardContent className="p-0">
                <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                      <TableRow className="h-8">
                        <TableHead className="w-14 text-blue-600 font-bold text-[9px] py-1">PATUNGAN</TableHead>
                        <TableHead className="w-10 text-xs py-1">NO</TableHead>
                        <TableHead className="text-xs py-1">NAMA PENGQURBAN</TableHead>
                        <TableHead className="text-xs py-1">ALAMAT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shohibulList.filter(s => s.jenisQurban === 'sapi-patungan').map((s, idx) => {
                        const groupNum = Math.floor(idx / 7) + 1;
                        const isGroupStart = idx % 7 === 0;
                        const rowBg = Math.floor(idx / 7) % 2 === 0 ? 'bg-white' : 'bg-blue-50/40';
                        
                        return (
                          <TableRow 
                            key={s.id} 
                            className={`${rowBg} hover:bg-blue-100/30 transition-colors border-b border-gray-100 h-7 ${isGroupStart ? 'border-t-2 border-blue-200' : ''}`}
                          >
                            <TableCell className="py-1 px-2 text-[9px] font-bold text-blue-700">
                              {isGroupStart ? `PATUNGAN ${groupNum}` : ''}
                            </TableCell>
                            <TableCell className="py-1 px-2 text-[10px] text-gray-400">{idx + 1}</TableCell>
                            <TableCell className="py-1 px-2 font-bold text-xs text-gray-800 truncate max-w-[140px]">{s.nama}</TableCell>
                            <TableCell className="py-1 px-2 text-[9px] text-gray-500 truncate max-w-[90px]">{s.alamat}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Kambing/Domba Section */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden lg:col-span-2">
              <div className="bg-green-600 p-2 text-white font-bold text-center flex items-center justify-center gap-2 text-sm">
                <div className="text-lg">🐐</div>
                DOMBA / KAMBING
              </div>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 p-2 bg-gray-50/30">
                  {/* We split the kambing list into two halves for a more compact view */}
                  {[0, 1].map((colIndex) => {
                    const kambingList = shohibulList.filter(s => !s.jenisQurban.startsWith('sapi'));
                    const half = Math.ceil(kambingList.length / 2);
                    const listPart = colIndex === 0 ? kambingList.slice(0, half) : kambingList.slice(half);
                    
                    if (kambingList.length === 0 && colIndex === 1) return null;
                    
                    return (
                      <div key={colIndex} className="overflow-hidden">
                        <Table>
                          <TableHeader className="bg-gray-100/50">
                            <TableRow className="h-8">
                              <TableHead className="w-10 text-[10px] py-1">NO</TableHead>
                              <TableHead className="text-[10px] py-1">NAMA</TableHead>
                              <TableHead className="text-[10px] py-1">ALAMAT</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {listPart.length > 0 ? (
                              listPart.map((s, idx) => (
                                <TableRow key={s.id} className="hover:bg-green-50/50 border-b border-gray-100 h-7">
                                  <TableCell className="py-1 px-2 text-[10px] text-gray-500">{colIndex * half + idx + 1}</TableCell>
                                  <TableCell className="py-1 px-2 font-semibold text-xs truncate max-w-[120px]">{s.nama}</TableCell>
                                  <TableCell className="py-1 px-2 text-[9px] text-gray-400 truncate max-w-[80px]">{s.alamat}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              colIndex === 0 && (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-2 text-gray-400 italic text-xs">Belum ada data</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* GALERI DOKUMENTASI HEWAN & SHOHIBUL */}
        <section className="space-y-4 pt-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-1.5 bg-blue-600 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600 animate-pulse" />
                Galeri Dokumentasi Hewan & Pengqurban
              </h2>
              <p className="text-xs text-gray-500 font-medium">Foto dokumentasi real-time dari posko penyembelihan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <Card key={animal.id} className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col bg-white group">
                  {/* Thumbnail Image */}
                  <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Dokumentasi ${animal.kode}`} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!hasPhotos ? 'opacity-40' : ''}`}
                    />
                    
                    {/* Animal Code Badge */}
                    <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-sm font-black tracking-wider shadow-md">
                      {animal.kode}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      animal.status === 'dipotong' 
                        ? 'bg-emerald-600 text-white' 
                        : animal.status === 'disembelih' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-blue-600 text-white'
                    }`}>
                      {animal.status}
                    </div>

                    {/* Animal Type Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide">
                      {animal.jenis.toUpperCase()}
                    </div>
                  </div>

                  {/* Donor Names */}
                  <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-2">
                      <div className="border-b pb-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Pengqurban</span>
                        <h4 className="font-bold text-gray-850 text-xs mt-0.5 truncate" title={label}>
                          {label}
                        </h4>
                      </div>

                      {isPatungan && (
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Daftar Lengkap (7 Orang)</span>
                          <div className="max-h-20 overflow-y-auto pr-1 space-y-0.5 scrollbar-thin">
                            {names.map((name, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                                <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                                <span className="truncate">{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>Bobot Hidup:</span>
                      <span className="text-gray-800 text-xs font-black">{animal.bobot ? `${Math.round(animal.bobot)} kg` : '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Footer info */}
        <footer className="text-center py-12 border-t border-gray-100">
          <div className="flex justify-center items-center gap-2 mb-4 text-gray-400">
            <Heart className="h-4 w-4 text-red-400 fill-red-400" />
            <span className="text-sm font-medium">Panitia Qurban Masjid As Sakinah Pantai Mentari</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 - Dikembangkan untuk kemudahan dan transparansi ibadah qurban
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Index;
