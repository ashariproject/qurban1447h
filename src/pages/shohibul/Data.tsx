
import React from 'react';
import Layout from '@/components/layout/Layout';

const ShohibulData = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Data Shohibul</h1>
        <p className="text-gray-500">Kelola data shohibul qurban seperti nama, kontak, dan alamat.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Data shohibul akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ShohibulData;
