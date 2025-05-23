
import React from 'react';
import Layout from '@/components/layout/Layout';

const Monitoring = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-gray-500">Pantau progres real-time semua tahapan qurban.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Data monitoring akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Monitoring;
