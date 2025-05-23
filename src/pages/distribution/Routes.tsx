
import React from 'react';
import Layout from '@/components/layout/Layout';

const DistributionRoutes = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Rute Distribusi</h1>
        <p className="text-gray-500">Kelola rute pendistribusian daging qurban.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Rute distribusi akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DistributionRoutes;
