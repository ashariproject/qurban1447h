
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Truck, CheckCircle, Clock, Package } from 'lucide-react';

const DistributionDashboard = () => {
  // Sample data - in real app this would come from context/API
  const distributionStats = {
    totalPenerima: 822,
    penerimaSelesai: 204,
    totalWilayah: 5,
    wilayahSelesai: 1,
    paketSapiTerdistribusi: 95,
    paketKambingTerdistribusi: 109,
    rutesAktif: 3
  };

  const wilayahData = [
    { nama: 'Shohibul Sapi', total: 21, selesai: 21, progress: 100, type: 'priority' },
    { nama: 'Shohibul Kambing', total: 12, selesai: 10, progress: 83, type: 'priority' },
    { nama: 'Pantai Mentari', total: 180, selesai: 45, progress: 25, type: 'residential' },
    { nama: 'Komplek AL', total: 25, selesai: 18, progress: 72, type: 'residential' },
    { nama: 'Warga Lain', total: 600, selesai: 110, progress: 18, type: 'general' }
  ];

  const activeRoutes = [
    { id: 1, driver: 'Tim A', area: 'Pantai Mentari', packages: 15, status: 'on-route', eta: '14:30' },
    { id: 2, driver: 'Tim B', area: 'Komplek AL', packages: 8, status: 'loading', eta: '15:00' },
    { id: 3, driver: 'Tim C', area: 'Warga Lain', packages: 20, status: 'on-route', eta: '16:15' }
  ];

  const getWilayahColor = (type: string) => {
    switch (type) {
      case 'priority': return 'border-l-red-500';
      case 'residential': return 'border-l-blue-500';
      case 'general': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-route': return 'text-blue-600 bg-blue-100';
      case 'loading': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard Distribusi</h1>
          <p className="text-teal-100">Pantau proses distribusi daging qurban ke seluruh penerima</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Penerima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{distributionStats.totalPenerima}</span>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Selesai: {distributionStats.penerimaSelesai}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Wilayah</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{distributionStats.totalWilayah}</span>
                <MapPin className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Selesai: {distributionStats.wilayahSelesai}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Paket Terdistribusi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">{distributionStats.paketSapiTerdistribusi + distributionStats.paketKambingTerdistribusi}</span>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Sapi: {distributionStats.paketSapiTerdistribusi}, Kambing: {distributionStats.paketKambingTerdistribusi}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rute Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">{distributionStats.rutesAktif}</span>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Tim distribusi</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Progress by Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Distribusi per Wilayah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wilayahData.map((wilayah, index) => (
                <div key={index} className={`border-l-4 ${getWilayahColor(wilayah.type)} pl-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{wilayah.nama}</span>
                      <span className="ml-2 text-sm text-gray-500">({wilayah.selesai}/{wilayah.total})</span>
                    </div>
                    <span className="text-sm font-medium">{wilayah.progress}%</span>
                  </div>
                  <Progress value={wilayah.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rute Distribusi Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(route.status)}`}>
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{route.driver}</p>
                      <p className="text-sm text-gray-600">{route.area}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{route.packages} paket</p>
                    <p className="text-xs text-gray-500">ETA: {route.eta}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(route.status)}`}>
                      {route.status === 'on-route' ? 'Dalam Perjalanan' : route.status === 'loading' ? 'Memuat' : 'Selesai'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DistributionDashboard;
