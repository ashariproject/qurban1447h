
import React from 'react';
import Layout from '@/components/layout/Layout';
import GoogleSheetsConfig from '@/components/integration/GoogleSheetsConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { Upload, FileSpreadsheet } from 'lucide-react';

const GoogleSheetsIntegration = () => {
  const { isLoading, syncShohibulData, syncDistributionData } = useGoogleSheets();

  // Sample data for testing
  const sampleShohibulData = [
    {
      id: '1',
      nama: 'Ahmad Susanto',
      alamat: 'Jl. Merdeka No. 123, Jakarta',
      noTelepon: '081234567890',
      jenisQurban: 'sapi-mandiri',
      jumlahHewan: 1,
      pembayaran: {
        status: 'lunas',
        jumlahDibayar: 18000000,
        totalBiaya: 18000000
      },
      tanggalDaftar: '2024-01-15'
    }
  ];

  const sampleDistributionData = [
    {
      id: 'DST001',
      tanggal: '2024-06-15',
      jenisDistribusi: 'shohibul',
      penerima: 'Ahmad Suryanto',
      noHp: '081234567890',
      wilayah: 'Pantai Mentari',
      sektor: 'Sektor 1 - Pantai Mentari Timur',
      jumlahPaket: 3,
      jenisKemasan: '2 Kg',
      status: 'terkirim',
      waktuKirim: '08:30',
      catatan: 'Diterima langsung oleh yang bersangkutan'
    }
  ];

  const handleSyncShohibul = () => {
    syncShohibulData(sampleShohibulData);
  };

  const handleSyncDistribution = () => {
    syncDistributionData(sampleDistributionData);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Integrasi Google Sheets</h1>
          <p className="text-blue-100">Sinkronisasi data aplikasi dengan Google Sheets</p>
        </div>

        <GoogleSheetsConfig />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Sinkronisasi Data
            </CardTitle>
            <CardDescription>
              Sinkronkan data dari aplikasi ke Google Sheets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleSyncShohibul}
                disabled={isLoading}
                className="h-20 flex flex-col gap-2"
              >
                <Upload className="h-6 w-6" />
                <span>Sync Data Shohibul</span>
              </Button>

              <Button 
                onClick={handleSyncDistribution}
                disabled={isLoading}
                className="h-20 flex flex-col gap-2"
              >
                <Upload className="h-6 w-6" />
                <span>Sync Data Distribusi</span>
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Catatan:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pastikan Google Sheet sudah dibuat dengan sheet bernama "Shohibul" dan "Distribusi"</li>
                <li>Data akan ditimpa setiap kali sinkronisasi</li>
                <li>Buat backup manual jika diperlukan</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GoogleSheetsIntegration;
