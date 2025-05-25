
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimalProcessForm from '@/components/animal/AnimalProcessForm';

const AnimalStatus = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Status Hewan</h1>
          <p className="text-gray-500">Pantau dan perbarui status hewan: diterima → disembelih → dipotong.</p>
        </div>
        
        <AnimalProcessForm />

        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">Status Hewan Terkini</h3>
          <p>Data status hewan yang sudah diproses akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AnimalStatus;
