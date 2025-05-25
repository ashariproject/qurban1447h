
import React from 'react';
import Layout from '@/components/layout/Layout';
import QurbanInputForm from '@/components/qurban/QurbanInputForm';

const ShohibulData = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Data Shohibul</h1>
          <p className="text-gray-500">Kelola data shohibul qurban seperti nama, kontak, dan alamat.</p>
        </div>
        
        <QurbanInputForm />

        <div className="border rounded-lg p-4 bg-white">
          <p>Data shohibul yang sudah tersimpan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ShohibulData;
