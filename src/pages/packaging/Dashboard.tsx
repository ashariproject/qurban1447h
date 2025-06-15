
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';

const PackagingDashboard = () => {
  // Sample data - in real app this would come from context/API
  const packagingStats = {
    totalPacksSapi: 45,
    totalPacksKambing: 60,
    packsSapiSiap: 38,
    packsKambingSiap: 52,
    packsSapiProses: 7,
    packsKambingProses: 8,
    estimasiBeratSapi: '380 kg',
    estimasiBeratKambing: '240 kg'
  };

  const packagingQueue = [
    { id: 1, type: 'Sapi', batch: 'SP-001', packs: 5, status: 'processing', estimatedTime: '30 menit' },
    { id: 2, type: 'Kambing', batch: 'KM-012', packs: 8, status: 'waiting', estimatedTime: '45 menit' },
    { id: 3, type: 'Sapi', batch: 'SP-002', packs: 3, status: 'completed', estimatedTime: 'Selesai' },
    { id: 4, type: 'Kambing', batch: 'KM-013', packs: 6, status: 'processing', estimatedTime: '20 menit' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'waiting': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard Pengemasan</h1>
          <p className="text-purple-100">Pantau proses pengemasan daging qurban dan persiapan distribusi</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Paket Sapi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{packagingStats.totalPacksSapi}</span>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Siap: {packagingStats.packsSapiSiap}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Paket Kambing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{packagingStats.totalPacksKambing}</span>
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Siap: {packagingStats.packsKambingSiap}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Dalam Proses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">{packagingStats.packsSapiProses + packagingStats.packsKambingProses}</span>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Sapi: {packagingStats.packsSapiProses}, Kambing: {packagingStats.packsKambingProses}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Siap Distribusi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">{packagingStats.packsSapiSiap + packagingStats.packsKambingSiap}</span>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Estimasi: {packagingStats.estimasiBeratSapi} + {packagingStats.estimasiBeratKambing}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Queue Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Pengemasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Paket Sapi</span>
                  <span className="text-sm text-gray-600">{packagingStats.packsSapiSiap}/{packagingStats.totalPacksSapi}</span>
                </div>
                <Progress value={(packagingStats.packsSapiSiap / packagingStats.totalPacksSapi) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Paket Kambing</span>
                  <span className="text-sm text-gray-600">{packagingStats.packsKambingSiap}/{packagingStats.totalPacksKambing}</span>
                </div>
                <Progress value={(packagingStats.packsKambingSiap / packagingStats.totalPacksKambing) * 100} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Progress</span>
                  <span className="text-sm text-gray-600">
                    {((packagingStats.packsSapiSiap + packagingStats.packsKambingSiap) / (packagingStats.totalPacksSapi + packagingStats.totalPacksKambing) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Antrian Pengemasan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {packagingQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.type} - {item.batch}</p>
                        <p className="text-xs text-gray-500">{item.packs} paket</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{item.estimatedTime}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status === 'processing' ? 'Proses' : item.status === 'waiting' ? 'Menunggu' : 'Selesai'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PackagingDashboard;
