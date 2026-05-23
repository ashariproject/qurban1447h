
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Beef, CheckCircle, Clock, Plus, BarChart3, Camera, QrCode } from 'lucide-react';
import { useQurban } from '@/contexts/QurbanContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AnimalDashboard = () => {
  const { hewanList } = useQurban();

  // REAL DATA FROM CONTEXT
  const totalSapi = hewanList.filter(h => h.jenis === 'sapi').length;
  const totalKambing = hewanList.filter(h => h.jenis === 'kambing').length;
  const sapiDisembelih = hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima').length;
  const kambingDisembelih = hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima').length;
  
  const stats = {
    totalSapi,
    totalKambing,
    sapiDisembelih,
    kambingDisembelih,
    sapiMenunggu: totalSapi - sapiDisembelih,
    kambingMenunggu: totalKambing - kambingDisembelih,
    totalDokumentasi: hewanList.reduce((acc, curr) => acc + (curr.fotoUrls?.length || 0), 0)
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">Panel Operasional Hewan</h1>
            <p className="text-orange-100 font-medium">Monitoring status penyembelihan dan dokumentasi karkas.</p>
            
            <div className="flex flex-wrap gap-2 mt-6">
              <Button asChild className="bg-white text-orange-700 hover:bg-orange-50 font-bold shadow-lg">
                <Link to="/animal/data">
                  <Plus className="h-4 w-4 mr-2" />
                  INPUT PROSES HEWAN
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                <Link to="/animal/documentation">
                  <Camera className="h-4 w-4 mr-2" />
                  UPLOAD DOKUMENTASI
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-10">
            <Beef size={200} />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hewan Sapi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-orange-600">{stats.totalSapi}</span>
                <Beef className="h-8 w-8 text-orange-200" />
              </div>
              <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase">Selesai: {stats.sapiDisembelih}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hewan Kambing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-green-600">{stats.totalKambing}</span>
                <Beef className="h-8 w-8 text-green-200" />
              </div>
              <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase">Selesai: {stats.kambingDisembelih}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sisa Antrian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-blue-600">{stats.sapiMenunggu + stats.kambingMenunggu}</span>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
              <p className="text-[10px] font-bold text-blue-500 mt-2 uppercase">Menunggu Proses</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dokumentasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-purple-600">{stats.totalDokumentasi}</span>
                <Camera className="h-8 w-8 text-purple-200" />
              </div>
              <p className="text-[10px] font-bold text-purple-500 mt-2 uppercase">Foto Terupload</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                PROGRES PENYEMBELIHAN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-600">HEWAN SAPI</span>
                  <span className="text-xs font-black text-orange-600">{stats.sapiDisembelih}/{stats.totalSapi}</span>
                </div>
                <Progress value={stats.totalSapi > 0 ? (stats.sapiDisembelih / stats.totalSapi) * 100 : 0} className="h-3 bg-orange-100" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-600">HEWAN KAMBING</span>
                  <span className="text-xs font-black text-green-600">{stats.kambingDisembelih}/{stats.totalKambing}</span>
                </div>
                <Progress value={stats.totalKambing > 0 ? (stats.kambingDisembelih / stats.totalKambing) * 100 : 0} className="h-3 bg-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Navigasi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Link to="/animal/foto-qr" className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all group">
                  <QrCode className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-orange-700">CETAK QR HEWAN</span>
                </Link>
                <Link to="/animal/meat-yield" className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <BarChart3 className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-700">ESTIMASI DAGING</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AnimalDashboard;
