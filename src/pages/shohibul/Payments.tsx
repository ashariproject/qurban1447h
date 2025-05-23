
import React from 'react';
import Layout from '@/components/layout/Layout';

const Payments = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Pembayaran</h1>
        <p className="text-gray-500">Validasi pembayaran dan konfirmasi shohibul qurban.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Data pembayaran akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
