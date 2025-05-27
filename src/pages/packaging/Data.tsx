
import React from 'react';
import Layout from '@/components/layout/Layout';
import PackagingDataTable from '@/components/packaging/PackagingDataTable';

const PackagingData = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Data Pengemasan</h1>
          <p className="text-gray-500">Kelola data input dan output pengemasan daging qurban.</p>
        </div>
        
        <PackagingDataTable />
      </div>
    </Layout>
  );
};

export default PackagingData;
