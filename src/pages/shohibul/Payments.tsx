
import React from 'react';
import Layout from '@/components/layout/Layout';
import ShohibulChecklistForm from '@/components/shohibul/ShohibulChecklistForm';

const Payments = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Pembayaran & Checklist</h1>
          <p className="text-gray-500">Validasi pembayaran, konfirmasi shohibul qurban, dan dokumentasi penyerahan.</p>
        </div>
        
        <ShohibulChecklistForm />
        
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">Data Pembayaran & Checklist</h3>
          <p>Data pembayaran dan checklist penyerahan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
