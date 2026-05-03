import React from 'react';
import Layout from '@/components/layout/Layout';
import QurbanInputForm from '@/components/qurban/QurbanInputForm';
import ShohibulDataTable from '@/components/shohibul/ShohibulDataTable';
import { useQurban, ShohibulData as SD } from '@/contexts/QurbanContext';

export type ShohibulData = SD;

const ShohibulDataPage = () => {
  const { shohibulList, addShohibul, editShohibul, deleteShohibul } = useQurban();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Data Shohibul</h1>
          <p className="text-gray-500">
            Kelola data shohibul qurban. Data tersimpan otomatis di perangkat ini (localStorage) dan setiap shohibul baru otomatis menghasilkan data hewan qurban dengan QR code.
          </p>
        </div>

        <QurbanInputForm onSubmit={addShohibul} />

        <ShohibulDataTable
          data={shohibulList}
          onEdit={editShohibul}
          onDelete={deleteShohibul}
        />
      </div>
    </Layout>
  );
};

export default ShohibulDataPage;
