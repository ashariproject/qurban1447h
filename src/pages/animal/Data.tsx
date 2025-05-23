
import React from 'react';
import Layout from '@/components/layout/Layout';

const AnimalData = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Data Hewan</h1>
        <p className="text-gray-500">Kelola data hewan qurban seperti jenis dan identitas.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Data hewan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AnimalData;
