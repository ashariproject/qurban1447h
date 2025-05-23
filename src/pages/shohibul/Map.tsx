
import React from 'react';
import Layout from '@/components/layout/Layout';

const LocationMap = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Peta Lokasi</h1>
        <p className="text-gray-500">Visualisasi peta lokasi shohibul qurban.</p>
        
        <div className="h-96 border rounded-lg p-4 bg-white flex items-center justify-center">
          <p className="text-gray-400">Peta akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default LocationMap;
