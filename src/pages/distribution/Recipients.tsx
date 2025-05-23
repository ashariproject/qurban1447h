
import React from 'react';
import Layout from '@/components/layout/Layout';

const Recipients = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Data Penerima</h1>
        <p className="text-gray-500">Kelola data penerima daging qurban.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Data penerima akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Recipients;
