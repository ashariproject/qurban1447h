import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import QurbanInputForm from '@/components/qurban/QurbanInputForm';
import ShohibulDataTable from '@/components/shohibul/ShohibulDataTable';
import SapiKolektifGroups from '@/components/shohibul/SapiKolektifGroups';
import { useQurban, ShohibulData as SD } from '@/contexts/QurbanContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, LayoutGrid, PlusCircle, Beef } from 'lucide-react';

export type ShohibulData = SD;

const ShohibulDataPage = () => {
  const { shohibulList, addShohibul, editShohibul, deleteShohibul } = useQurban();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddShohibul = async (data: any) => {
    await addShohibul(data);
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Area */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg px-6 py-4 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Data Shohibul</h1>
            <p className="text-blue-100 text-xs">Kelola pendaftaran dan pembagian kelompok qurban</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Modal Dialog for Registration Form */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Tambah Shohibul
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-xl">
                <QurbanInputForm onSubmit={handleAddShohibul} />
              </DialogContent>
            </Dialog>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-gray-100/50 p-1">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Data Sohibul
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              GRUP SAPI PATUNGAN
            </TabsTrigger>
            <TabsTrigger value="sapi-mandiri" className="flex items-center gap-2">
              <Beef className="h-4 w-4" />
              SAPI MANDIRI
            </TabsTrigger>
            <TabsTrigger value="kambing" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              KAMBING
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="sapi-mandiri">
            <ShohibulDataTable
              data={shohibulList.filter(s => s.jenisQurban === 'sapi-mandiri')}
              onEdit={editShohibul}
              onDelete={deleteShohibul}
            />
          </TabsContent>

          <TabsContent value="kambing">
            <ShohibulDataTable
              data={shohibulList.filter(s => s.jenisQurban === 'kambing-mandiri' || s.jenisQurban === 'kambing-titip-beli')}
              onEdit={editShohibul}
              onDelete={deleteShohibul}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ShohibulDataPage;
