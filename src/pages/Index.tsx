
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Beef, Package, Truck, Settings, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-4 md:mb-6">
            <img 
              src="http://assakinahpantaimentari.org/logoyysn.jpg" 
              alt="Logo Masjid As Sakinah Pantai Mentari"
              className="h-16 md:h-24 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4 px-2">
            Sistem Manajemen Qurban
          </h1>
          <h2 className="text-lg md:text-2xl font-semibold text-green-700 mb-2 md:mb-4 px-2">
            Masjid As Sakinah Pantai Mentari
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Platform terintegrasi untuk mengelola seluruh proses qurban dari registrasi hingga distribusi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {/* Admin Dashboard */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center p-4 md:p-6">
              <div className="mx-auto bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg md:text-xl">Admin Dashboard</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Panel kontrol utama untuk monitoring seluruh aktivitas qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <Button asChild className="w-full">
                <a href="/admin">Akses Dashboard</a>
              </Button>
            </CardContent>
          </Card>

          {/* Shohibul Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center p-4 md:p-6">
              <div className="mx-auto bg-green-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg md:text-xl">Data Shohibul</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Kelola registrasi dan status shohibul qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 md:p-6 pt-0">
              <Button asChild className="w-full text-sm md:text-base" variant="default">
                <a href="/shohibul">Dashboard Shohibul</a>
              </Button>
              <Button asChild className="w-full text-sm md:text-base" variant="outline">
                <a href="/shohibul/data">Input Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Animal Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center p-4 md:p-6">
              <div className="mx-auto bg-orange-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Beef className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg md:text-xl">Data Hewan</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Kelola data dan proses hewan qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 md:p-6 pt-0">
              <Button asChild className="w-full text-sm md:text-base" variant="default">
                <a href="/animal">Dashboard Hewan</a>
              </Button>
              <Button asChild className="w-full text-sm md:text-base" variant="outline">
                <a href="/animal/data">Input Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Packaging Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center p-4 md:p-6">
              <div className="mx-auto bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Package className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg md:text-xl">Pengemasan</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Kelola proses pengemasan daging qurban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 md:p-6 pt-0">
              <Button asChild className="w-full text-sm md:text-base" variant="default">
                <a href="/packaging">Dashboard Packaging</a>
              </Button>
              <Button asChild className="w-full text-sm md:text-base" variant="outline">
                <a href="/packaging/data">Input Data</a>
              </Button>
            </CardContent>
          </Card>

          {/* Distribution Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center p-4 md:p-6">
              <div className="mx-auto bg-teal-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Truck className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
              </div>
              <CardTitle className="text-lg md:text-xl">Distribusi</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Kelola distribusi daging kepada penerima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 md:p-6 pt-0">
              <Button asChild className="w-full text-sm md:text-base" variant="default">
                <a href="/distribution">Dashboard Distribusi</a>
              </Button>
              <Button asChild className="w-full text-sm md:text-base" variant="outline">
                <a href="/distribution/recipients">Data Penerima</a>
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1">
            <CardHeader className="text-center p-4 md:p-6">
              <div className="mx-auto bg-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Settings className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
              </div>
              <CardTitle className="text-lg md:text-xl">Pengaturan</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Konfigurasi sistem dan manajemen pengguna
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <Button asChild className="w-full text-sm md:text-base" variant="outline">
                <a href="/admin/settings">Buka Pengaturan</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm md:text-base text-gray-600">
            Developed with ❤️ for better qurban management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
