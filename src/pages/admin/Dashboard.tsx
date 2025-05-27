
import React from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import MasterResetForm from '@/components/admin/MasterResetForm';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Panel kontrol utama untuk monitoring seluruh aktivitas qurban</p>
        </div>

        {/* Master Reset Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MasterResetForm />
          </div>
          
          {/* Quick Access to All Roles */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Data Shohibul</h3>
              <p className="text-green-100 text-sm">Kelola registrasi shohibul qurban</p>
              <div className="mt-3">
                <a href="/shohibul/data" className="text-white underline hover:text-green-200">Akses Menu →</a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Data Hewan</h3>
              <p className="text-orange-100 text-sm">Kelola data dan proses hewan qurban</p>
              <div className="mt-3">
                <a href="/animal/data" className="text-white underline hover:text-orange-200">Akses Menu →</a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Pengemasan</h3>
              <p className="text-purple-100 text-sm">Kelola proses pengemasan daging</p>
              <div className="mt-3">
                <a href="/packaging/data" className="text-white underline hover:text-purple-200">Akses Menu →</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <Dashboard />
      </div>
    </Layout>
  );
};

export default AdminDashboard;
