
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Beef, Package, Truck, Settings, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistem Manajemen Qurban
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Platform terintegrasi untuk mengelola seluruh proses qurban dari registrasi hingga distribusi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Admin Dashboard */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Admin Dashboard</CardTitle>
              <CardDescription>
                Panel kontrol utama untuk monitoring seluruh aktivitas qurban
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin">Akses Dashboard</a>
              </Button>
            </CardContent>
          </Card>

          {/* Shohibul Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Data Shohibul</CardTitle>
              <CardDescription>
                Kelola registrasi dan status shohibul qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="default">
                <a href="/shohibul">Dashboard Shohibul</a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/shohibul/data">Input Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Animal Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Beef className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Data Hewan</CardTitle>
              <CardDescription>
                Kelola data dan proses hewan qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="default">
                <a href="/animal">Dashboard Hewan</a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/animal/data">Input Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Packaging Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Pengemasan</CardTitle>
              <CardDescription>
                Kelola proses pengemasan daging qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="default">
                <a href="/packaging">Dashboard Packaging</a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/packaging/data">Input Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Distribution Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-xl">Distribusi</CardTitle>
              <CardDescription>
                Kelola distribusi daging kepada penerima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" variant="default">
                <a href="/distribution">Dashboard Distribusi</a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/distribution/recipients">Data Penerima</a>
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-gray-600" />
              </div>
              <CardTitle className="text-xl">Pengaturan</CardTitle>
              <CardDescription>
                Konfigurasi sistem dan manajemen pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <a href="/admin/settings">Buka Pengaturan</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Developed with ❤️ for better qurban management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
