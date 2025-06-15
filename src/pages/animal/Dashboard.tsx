
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Beef, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const AnimalDashboard = () => {
  // Sample data - in real app this would come from context/API
  const animalStats = {
    totalSapi: 15,
    totalKambing: 25,
    sapiDisembelih: 12,
    kambingDisembelih: 18,
    sapiMenunggu: 3,
    kambingMenunggu: 7,
    totalDokumentasi: 30
  };

  const recentActivities = [
    { id: 1, type: 'sembelih', animal: 'Sapi #S001', time: '10:30', status: 'completed' },
    { id: 2, type: 'dokumentasi', animal: 'Kambing #K012', time: '11:15', status: 'completed' },
    { id: 3, type: 'penerimaan', animal: 'Sapi #S002', time: '12:00', status: 'pending' },
    { id: 4, type: 'sembelih', animal: 'Kambing #K013', time: '13:30', status: 'in-progress' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard Hewan</h1>
          <p className="text-orange-100">Pantau data hewan qurban dan proses penyembelihan secara real-time</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sapi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{animalStats.totalSapi}</span>
                <Beef className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Disembelih: {animalStats.sapiDisembelih}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Kambing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{animalStats.totalKambing}</span>
                <Beef className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Disembelih: {animalStats.kambingDisembelih}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Menunggu Proses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">{animalStats.sapiMenunggu + animalStats.kambingMenunggu}</span>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Sapi: {animalStats.sapiMenunggu}, Kambing: {animalStats.kambingMenunggu}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Dokumentasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">{animalStats.totalDokumentasi}</span>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Foto & Video</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Penyembelihan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Sapi</span>
                  <span className="text-sm text-gray-600">{animalStats.sapiDisembelih}/{animalStats.totalSapi}</span>
                </div>
                <Progress value={(animalStats.sapiDisembelih / animalStats.totalSapi) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Kambing</span>
                  <span className="text-sm text-gray-600">{animalStats.kambingDisembelih}/{animalStats.totalKambing}</span>
                </div>
                <Progress value={(animalStats.kambingDisembelih / animalStats.totalKambing) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktivitas Terkini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(activity.status)}
                      <div>
                        <p className="text-sm font-medium">{activity.animal}</p>
                        <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <p className={`text-xs capitalize ${getStatusColor(activity.status)}`}>
                        {activity.status === 'in-progress' ? 'Proses' : activity.status === 'pending' ? 'Menunggu' : 'Selesai'}
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

export default AnimalDashboard;
