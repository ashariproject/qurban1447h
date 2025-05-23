
import React from 'react';
import Layout from '@/components/layout/Layout';

const UsersManagement = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <p className="text-gray-500">Kelola akun petugas dan pengaturan akses pengguna.</p>
        
        <div className="border rounded-lg p-4 bg-white">
          <p>Daftar pengguna akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default UsersManagement;
