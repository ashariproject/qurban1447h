
import React from 'react';
import Layout from '@/components/layout/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Laporan</h1>
        <p className="text-gray-500">Lihat dan unduh laporan kegiatan qurban.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Laporan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
