
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import QurbanInputForm from '@/components/qurban/QurbanInputForm';
import ShohibulDataTable from '@/components/shohibul/ShohibulDataTable';

export interface ShohibulData {
  id: string;
  nama: string;
  alamat: string;
  noTelepon: string;
  jenisQurban: 'sapi-mandiri' | 'kambing-mandiri';
  jumlahHewan: number;
  tanggalDaftar: string;
}

const ShohibulData = () => {
  const [shohibulList, setShohibulList] = useState<ShohibulData[]>([
    {
      id: '1',
      nama: 'Ahmad Susanto',
      alamat: 'Jl. Merdeka No. 123, Jakarta',
      noTelepon: '081234567890',
      jenisQurban: 'sapi-mandiri',
      jumlahHewan: 1,
      tanggalDaftar: '2024-01-15'
    },
    {
      id: '2',
      nama: 'Siti Nurhaliza',
      alamat: 'Jl. Sudirman No. 456, Bandung',
      noTelepon: '081987654321',
      jenisQurban: 'kambing-mandiri',
      jumlahHewan: 2,
      tanggalDaftar: '2024-01-16'
    }
  ]);

  const handleAddShohibul = (newData: Omit<ShohibulData, 'id' | 'tanggalDaftar'>) => {
    const newShohibul: ShohibulData = {
      ...newData,
      id: Date.now().toString(),
      tanggalDaftar: new Date().toISOString().split('T')[0]
    };
    setShohibulList(prev => [...prev, newShohibul]);
  };

  const handleEditShohibul = (id: string, updatedData: Partial<ShohibulData>) => {
    setShohibulList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
  };

  const handleDeleteShohibul = (id: string) => {
    setShohibulList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Data Shohibul</h1>
          <p className="text-gray-500">Kelola data shohibul qurban seperti nama, kontak, dan alamat.</p>
        </div>
        
        <QurbanInputForm onSubmit={handleAddShohibul} />

        <ShohibulDataTable 
          data={shohibulList}
          onEdit={handleEditShohibul}
          onDelete={handleDeleteShohibul}
        />
      </div>
    </Layout>
  );
};

export default ShohibulData;
