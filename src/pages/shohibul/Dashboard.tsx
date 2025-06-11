
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ShohibulStatusTable from '@/components/shohibul/ShohibulStatusTable';

export interface ShohibulStatusData {
  id: string;
  nama: string;
  jenisQurban: 'sapi-mandiri' | 'kambing-mandiri' | 'kambing-titip-beli' | 'sapi-patungan';
  jumlahHewan: number;
  statusDatang: boolean;
  statusSiapSembelih: boolean;
  statusSiapKirim: boolean;
  statusTelahTerima: boolean;
  tanggalDaftar: string;
}

const ShohibulDashboard = () => {
  const [shohibulStatusList] = useState<ShohibulStatusData[]>([
    {
      id: '1',
      nama: 'Ahmad Susanto',
      jenisQurban: 'sapi-mandiri',
      jumlahHewan: 1,
      statusDatang: true,
      statusSiapSembelih: true,
      statusSiapKirim: false,
      statusTelahTerima: false,
      tanggalDaftar: '2024-01-15'
    },
    {
      id: '2',
      nama: 'Siti Nurhaliza',
      jenisQurban: 'kambing-mandiri',
      jumlahHewan: 2,
      statusDatang: false,
      statusSiapSembelih: false,
      statusSiapKirim: false,
      statusTelahTerima: false,
      tanggalDaftar: '2024-01-16'
    },
    {
      id: '3',
      nama: 'Budi Santoso',
      jenisQurban: 'sapi-mandiri',
      jumlahHewan: 1,
      statusDatang: true,
      statusSiapSembelih: true,
      statusSiapKirim: true,
      statusTelahTerima: true,
      tanggalDaftar: '2024-01-10'
    }
  ]);

  const updateStatus = (id: string, field: keyof Omit<ShohibulStatusData, 'id' | 'nama' | 'jenisQurban' | 'jumlahHewan' | 'tanggalDaftar'>, value: boolean) => {
    // Implementation for updating status would go here
    console.log(`Updating ${field} for ${id} to ${value}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard Shohibul</h1>
          <p className="text-green-100">Pantau status lengkap shohibul qurban mulai dari kedatangan hingga penyerahan</p>
        </div>

        <ShohibulStatusTable 
          data={shohibulStatusList}
          onUpdateStatus={updateStatus}
        />
      </div>
    </Layout>
  );
};

export default ShohibulDashboard;
