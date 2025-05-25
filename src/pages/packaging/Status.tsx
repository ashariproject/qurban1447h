
import React from 'react';
import Layout from '@/components/layout/Layout';
import PackagingInputForm from '@/components/packaging/PackagingInputForm';

const PackagingStatus = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Status Paket</h1>
          <p className="text-gray-500">Pantau dan perbarui status paket: dikemas / siap distribusi.</p>
        </div>
        
        <PackagingInputForm />
        
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">Status Pengemasan Terkini</h3>
          <p>Data status pengemasan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PackagingStatus;
