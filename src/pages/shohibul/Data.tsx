import React from 'react';
import Layout from '@/components/layout/Layout';
import QurbanInputForm from '@/components/qurban/QurbanInputForm';
import ShohibulDataTable from '@/components/shohibul/ShohibulDataTable';
import SapiKolektifGroups from '@/components/shohibul/SapiKolektifGroups';
import { useQurban, ShohibulData as SD } from '@/contexts/QurbanContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LayoutGrid, PlusCircle } from 'lucide-react';

export type ShohibulData = SD;

const ShohibulDataPage = () => {
  const { shohibulList, addShohibul, editShohibul, deleteShohibul } = useQurban();

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg px-6 py-4 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Data Shohibul</h1>
            <p className="text-blue-100 text-xs">Kelola pendaftaran dan pembagian kelompok qurban</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100/50 p-1">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Pendaftaran
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Daftar Shohibul
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Grup Sapi Patungan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <QurbanInputForm onSubmit={addShohibul} />
          </TabsContent>

          <TabsContent value="list">
            <ShohibulDataTable
              data={shohibulList}
              onEdit={editShohibul}
              onDelete={deleteShohibul}
            />
          </TabsContent>

          <TabsContent value="groups">
            <SapiKolektifGroups shohibulList={shohibulList} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ShohibulDataPage;
