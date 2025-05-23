
import React from 'react';
import Layout from '@/components/layout/Layout';

const DeliveryStatus = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Status Pengiriman</h1>
        <p className="text-gray-500">Pantau dan perbarui status pengiriman: terkirim / belum.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Status pengiriman akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryStatus;
