
import React from 'react';
import Layout from '@/components/layout/Layout';

const AnimalStatus = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Status Hewan</h1>
        <p className="text-gray-500">Pantau dan perbarui status hewan: diterima → disembelih → dipotong.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Status hewan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AnimalStatus;
