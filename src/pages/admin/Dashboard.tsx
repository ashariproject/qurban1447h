
import React from 'react';
import Layout from '@/components/layout/Layout';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Selamat datang di panel admin. Di sini Anda dapat mengakses seluruh fitur dan data.</p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
