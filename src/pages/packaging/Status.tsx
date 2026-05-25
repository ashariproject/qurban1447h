import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Beef,
  Activity,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { useQurban } from '@/contexts/QurbanContext';

const PackagingStatus = () => {
  const { packagingData, hewanList } = useQurban();

  const sapiInput  = packagingData.sapiPacksInput  || 0;
  const sapiOutput = packagingData.sapiPacksOutput || 0;
  const kambingInput  = packagingData.kambingPacksInput  || 0;
  const kambingOutput = packagingData.kambingPacksOutput || 0;

  const totalInput  = sapiInput + kambingInput;
  const totalOutput = sapiOutput + kambingOutput;
  const totalSisa   = totalInput - totalOutput;

  const pctSapi    = sapiInput    > 0 ? Math.round((sapiOutput    / sapiInput)    * 100) : 0;
  const pctKambing = kambingInput > 0 ? Math.round((kambingOutput / kambingInput) * 100) : 0;
  const pctTotal   = totalInput   > 0 ? Math.round((totalOutput   / totalInput)   * 100) : 0;

  // Hitung hewan yang sudah dipotong (siap dikemas)
  const hewanDipotong  = hewanList.filter(h => h.status === 'dipotong').length;
  const hewanDisembelih = hewanList.filter(h => h.status === 'disembelih').length;
  const hewanDiterima   = hewanList.filter(h => h.status === 'diterima').length;
  const totalHewan      = hewanList.length;

  const getStatusBadge = (pct: number) => {
    if (pct >= 100) return { label: 'Selesai',       color: 'bg-emerald-500', icon: CheckCircle2 };
    if (pct >= 50)  return { label: 'Berjalan',      color: 'bg-blue-500',    icon: Activity };
    if (pct > 0)    return { label: 'Mulai',         color: 'bg-amber-500',   icon: Clock };
    return           { label: 'Belum Mulai',         color: 'bg-gray-400',    icon: AlertCircle };
  };

  const sapiStatus    = getStatusBadge(pctSapi);
  const kambingStatus = getStatusBadge(pctKambing);
  const totalStatus   = getStatusBadge(pctTotal);

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">

        {/* Header */}
        <div className="bg-gradient-to-br from-amber-600 via-orange-700 to-red-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <BarChart3 className="h-6 w-6 text-orange-200" />
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Status Paket</h1>
            </div>
            <p className="text-orange-100 font-medium max-w-xl">
              Pantau progres produksi kemasan daging qurban secara real-time — target, realisasi, dan sisa stok.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Package size={140} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Target</p>
              <p className="text-3xl font-black text-gray-800">{totalInput}</p>
              <p className="text-xs text-gray-400 mt-1">Pack direncanakan</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sudah Dikemas</p>
              <p className="text-3xl font-black text-emerald-600">{totalOutput}</p>
              <p className="text-xs text-gray-400 mt-1">Pack selesai</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sisa Produksi</p>
              <p className="text-3xl font-black text-amber-600">{totalSisa}</p>
              <p className="text-xs text-gray-400 mt-1">Pack belum dikemas</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Progres</p>
              <p className="text-3xl font-black text-blue-600">{pctTotal}%</p>
              <p className="text-xs text-gray-400 mt-1">Dari total target</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Detail per Jenis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SAPI */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-gray-800">
                  <Beef className="h-5 w-5 text-orange-600" />
                  Paket Daging Sapi
                </div>
                <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${sapiStatus.color}`}>
                  <sapiStatus.icon className="h-3 w-3" />
                  {sapiStatus.label}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Progres Pengemasan Sapi</span>
                  <span className="text-orange-600">{pctSapi}%</span>
                </div>
                <Progress value={pctSapi} className="h-3 bg-orange-100" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target</p>
                  <p className="text-2xl font-black text-green-700">{sapiInput}</p>
                  <p className="text-[9px] text-gray-400">Pack</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Selesai</p>
                  <p className="text-2xl font-black text-emerald-700">{sapiOutput}</p>
                  <p className="text-[9px] text-gray-400">Pack</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sisa</p>
                  <p className="text-2xl font-black text-amber-700">{sapiInput - sapiOutput}</p>
                  <p className="text-[9px] text-gray-400">Pack</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
                <Truck className="h-4 w-4 text-orange-600 shrink-0" />
                <p className="text-xs text-orange-700 font-medium">
                  {sapiOutput} pack sapi siap didistribusikan
                </p>
              </div>
            </CardContent>
          </Card>

          {/* KAMBING */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-gray-800">
                  <Package className="h-5 w-5 text-blue-600" />
                  Paket Daging Kambing
                </div>
                <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${kambingStatus.color}`}>
                  <kambingStatus.icon className="h-3 w-3" />
                  {kambingStatus.label}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Progres Pengemasan Kambing</span>
                  <span className="text-blue-600">{pctKambing}%</span>
                </div>
                <Progress value={pctKambing} className="h-3 bg-blue-100" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target</p>
                  <p className="text-2xl font-black text-blue-700">{kambingInput}</p>
                  <p className="text-[9px] text-gray-400">Pack</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Selesai</p>
                  <p className="text-2xl font-black text-emerald-700">{kambingOutput}</p>
                  <p className="text-[9px] text-gray-400">Pack</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sisa</p>
                  <p className="text-2xl font-black text-amber-700">{kambingInput - kambingOutput}</p>
                  <p className="text-[9px] text-gray-400">Pack</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700 font-medium">
                  {kambingOutput} pack kambing siap didistribusikan
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Hewan (Sumber Bahan Baku) */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-gray-800">
              <Activity className="h-5 w-5 text-purple-600" />
              Status Hewan (Sumber Bahan Baku)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="bg-gray-50 border rounded-xl p-4 text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Hewan</p>
                <p className="text-3xl font-black text-gray-800">{totalHewan}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Diterima</p>
                <p className="text-3xl font-black text-blue-700">{hewanDiterima}</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Disembelih</p>
                <p className="text-3xl font-black text-orange-700">{hewanDisembelih}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dipotong ✓</p>
                <p className="text-3xl font-black text-emerald-700">{hewanDipotong}</p>
              </div>
            </div>

            {totalHewan > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Hewan Selesai Dipotong (Siap Dikemas)</span>
                  <span className="text-emerald-600">{totalHewan > 0 ? Math.round((hewanDipotong / totalHewan) * 100) : 0}%</span>
                </div>
                <Progress value={totalHewan > 0 ? (hewanDipotong / totalHewan) * 100 : 0} className="h-3 bg-gray-100" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Status Banner */}
        <Card className={`border-none shadow-md overflow-hidden`}>
          <CardContent className="p-0">
            <div className={`flex items-center gap-4 p-5 ${totalStatus.color} text-white`}>
              <totalStatus.icon className="h-8 w-8 shrink-0" />
              <div>
                <p className="font-black text-lg uppercase tracking-wide">
                  Status Keseluruhan: {totalStatus.label}
                </p>
                <p className="text-white/80 text-sm font-medium">
                  {totalOutput} dari {totalInput} pack telah selesai dikemas ({pctTotal}%) —{' '}
                  {totalSisa > 0 ? `${totalSisa} pack lagi perlu diselesaikan` : 'Semua pack sudah selesai! 🎉'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export default PackagingStatus;
