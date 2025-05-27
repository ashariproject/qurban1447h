
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimalDataForm from '@/components/animal/AnimalDataForm';

const AnimalData = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Data Hewan</h1>
          <p className="text-gray-500">Kelola data hewan qurban seperti jenis dan identitas, serta proses penyembelihan dan pengeletan.</p>
        </div>
        
        <AnimalDataForm />
      </div>
    </Layout>
  );
};

export default AnimalData;
