import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package, CheckCircle, Clock, Truck, Activity, Beef, Zap } from 'lucide-react';
import { useQurban } from '@/contexts/QurbanContext';
import PackagingEntryForm from '@/components/dashboard/PackagingEntryForm';

const PackagingDashboard = () => {
  const { packagingData } = useQurban();

  // REAL DATA FROM CONTEXT
  const stats = {
    totalPacksSapi: packagingData.sapiPacksInput,
    totalPacksKambing: packagingData.kambingPacksInput,
    packsSapiSiap: packagingData.sapiPacksOutput,
    packsKambingSiap: packagingData.kambingPacksOutput,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header - Premium Look */}
        <div className="bg-gradient-to-br from-amber-600 via-orange-700 to-orange-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Package className="h-6 w-6 text-orange-200" />
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Produksi Pengemasan</h1>
            </div>
            <p className="text-orange-100 font-medium max-w-xl">
              Panel monitoring untuk tim produksi pengemasan daging qurban. Pantau target dan realisasi output harian.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity size={120} />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Beef className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Sapi</p>
                <p className="text-2xl font-black text-gray-800">{stats.totalPacksSapi} <span className="text-xs font-normal text-gray-400">Pkt</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Kambing</p>
                <p className="text-2xl font-black text-gray-800">{stats.totalPacksKambing} <span className="text-xs font-normal text-gray-400">Pkt</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Output</p>
                <p className="text-2xl font-black text-emerald-600">{stats.packsSapiSiap + stats.packsKambingSiap}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sisa Produksi</p>
                <p className="text-2xl font-black text-blue-600">
                  {Math.max(0, (stats.totalPacksSapi + stats.totalPacksKambing) - (stats.packsSapiSiap + stats.packsKambingSiap))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Form */}
          <div className="lg:col-span-2">
            <PackagingEntryForm />
          </div>

          {/* Quick Status Bar */}
          <div className="space-y-4">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="bg-gray-50 border-b p-4">
                <CardTitle className="text-sm font-black flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-600" />
                  PROGRES PRODUKSI
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-600">PAKET SAPI</span>
                    <span className="text-xs font-black text-orange-600">
                      {stats.packsSapiSiap}/{stats.totalPacksSapi}
                    </span>
                  </div>
                  <Progress value={stats.totalPacksSapi > 0 ? (stats.packsSapiSiap / stats.totalPacksSapi) * 100 : 0} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-600">PAKET KAMBING</span>
                    <span className="text-xs font-black text-purple-600">
                      {stats.packsKambingSiap}/{stats.totalPacksKambing}
                    </span>
                  </div>
                  <Progress value={stats.totalPacksKambing > 0 ? (stats.packsKambingSiap / stats.totalPacksKambing) * 100 : 0} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                      *Target (Input) dihitung secara otomatis berdasarkan berat daging murni dari timbangan hewan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PackagingDashboard;
