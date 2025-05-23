
import React from 'react';
import Layout from '@/components/layout/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-gray-500">Konfigurasi sistem dan preferensi aplikasi.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Pengaturan sistem akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
