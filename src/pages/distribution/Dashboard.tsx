import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Truck, Package, CheckCircle, Activity, LayoutDashboard } from 'lucide-react';
import { useQurban } from '@/contexts/QurbanContext';
import DistributionEntryForm from '@/components/dashboard/DistributionEntryForm';
import DistributionCard from '@/components/dashboard/DistributionCard';

const DistributionDashboard = () => {
  const { shohibulList, distributionList, packagingData } = useQurban();

  // REAL DATA CALCULATIONS
  const shohibulSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi')).length;
  const shohibulKambing = shohibulList.filter(s => s.jenisQurban.startsWith('kambing')).length;
  
  const diterimaSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const diterimaKambing = shohibulList.filter(s => !s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;

  const finalDistributionData = distributionList.map(item => {
    if (item.id === 'shohibul-sapi') {
      return { ...item, subtitle: `${shohibulSapi} Shohibul`, current: diterimaSapi, total: shohibulSapi };
    }
    if (item.id === 'shohibul-kambing') {
      return { ...item, subtitle: `${shohibulKambing} Shohibul`, current: diterimaKambing, total: shohibulKambing };
    }
    return item;
  });

  const totalPacksDistributed = finalDistributionData.reduce((acc, curr) => acc + curr.current, 0);
  const totalTargetPacks = finalDistributionData.reduce((acc, curr) => acc + curr.total, 0);
  const totalPenerima = finalDistributionData.reduce((acc, d) => acc + d.total, 0);
  const penerimaSelesai = finalDistributionData.reduce((acc, d) => acc + d.current, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header - Premium Look */}
        <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-blue-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Truck className="h-6 w-6 text-blue-200" />
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Monitoring Distribusi</h1>
            </div>
            <p className="text-blue-100 font-medium max-w-xl">
              Panel kontrol khusus Hari-H untuk memantau penyaluran daging qurban ke Shohibul dan warga sekitar.
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <LayoutDashboard size={120} />
          </div>
        </div>

        {/* Live Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Target</p>
                <p className="text-2xl font-black text-gray-800">{totalPenerima} <span className="text-xs font-normal">KK</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Telah Terkirim</p>
                <p className="text-2xl font-black text-emerald-600">{penerimaSelesai} <span className="text-xs font-normal">Pkt</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pkt Dikemas</p>
                <p className="text-2xl font-black text-orange-600">{packagingData.sapiPacksOutput + packagingData.kambingPacksOutput}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sisa Belum</p>
                <p className="text-2xl font-black text-purple-600">{Math.max(0, totalTargetPacks - totalPacksDistributed)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Update Form - CRITICAL for Day H */}
           <div className="lg:col-span-2 space-y-6">
              <DistributionEntryForm />
              
              <Card className="border-none shadow-md bg-white">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  STATUS PER WILAYAH
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {finalDistributionData.map((wilayah) => (
                  <div key={wilayah.id} className="space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className={`h-2 w-2 rounded-full ${wilayah.bgColor.replace('bg-gradient-to-br ', '').split(' ')[0]}`} />
                         <span className="font-bold text-sm text-gray-700">{wilayah.title}</span>
                         <span className="text-[10px] font-bold text-gray-400">({wilayah.current}/{wilayah.total})</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600">
                        {wilayah.total > 0 ? Math.round((wilayah.current / wilayah.total) * 100) : 0}%
                      </span>
                    </div>
                    <Progress value={wilayah.total > 0 ? (wilayah.current / wilayah.total) * 100 : 0} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
           </div>

           {/* Quick Status View */}
           <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-800 flex items-center gap-2 uppercase tracking-widest px-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                RINGKASAN LIVE
              </h3>
              <div className="space-y-2">
                {finalDistributionData.map((item, index) => (
                  <DistributionCard 
                    key={index}
                    title={item.title}
                    subtitle={item.subtitle}
                    current={item.current} 
                    total={item.total}
                    bgColor={item.bgColor}
                  />
                ))}
              </div>

              <Card className="bg-indigo-50 border border-indigo-100 mt-6">
                <CardContent className="p-4">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">Petunjuk Petugas</h4>
                  <p className="text-[10px] text-indigo-600 leading-relaxed italic">
                    Perbarui data setiap kali tim distribusi kembali dari lapangan atau memberikan laporan melalui grup koordinasi. 
                    Pastikan angka "Terkirim" tidak melebihi "Target".
                  </p>
                </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default DistributionDashboard;
