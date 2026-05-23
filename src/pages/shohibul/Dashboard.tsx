
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import ShohibulStatusTable from '@/components/shohibul/ShohibulStatusTable';
import SapiKolektifGroups from '@/components/shohibul/SapiKolektifGroups';
import AnimalWeightEntry from '@/components/animal/AnimalWeightEntry';
import { useQurban } from '@/contexts/QurbanContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LayoutGrid, Calculator, Plus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface ShohibulStatusData {
  id: string;
  nama: string;
  jenisQurban: 'sapi-mandiri' | 'kambing-mandiri' | 'kambing-titip-beli' | 'sapi-patungan';
  jumlahHewan: number;
  statusDatang: boolean;
  statusSiapSembelih: boolean;
  statusSiapKirim: boolean;
  statusTelahTerima: boolean;
  fotoTerima?: string;
  tanggalDaftar: string;
}

const ShohibulDashboard = () => {
  const { shohibulList, updateShohibulStatus } = useQurban();
  
  const shohibulStatusList = useMemo(() => {
    return shohibulList.map(s => ({
      id: s.id,
      nama: s.nama,
      jenisQurban: s.jenisQurban,
      jumlahHewan: s.jumlahHewan,
      statusDatang: s.status?.datang ?? true,
      statusSiapSembelih: s.status?.siapSembelih ?? false,
      statusSiapKirim: s.status?.siapKirim ?? false,
      statusTelahTerima: s.status?.telahTerima ?? false,
      fotoTerima: s.status?.fotoTerima,
      tanggalDaftar: s.tanggalDaftar,
    } as ShohibulStatusData));
  }, [shohibulList]);

  const updateStatus = (id: string, field: string, value: any) => {
    updateShohibulStatus(id, field, value);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white rounded-2xl px-6 py-6 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight uppercase mb-1">Monitoring Shohibul</h1>
            <p className="text-green-100 font-medium">Status real-time kedatangan & pengiriman paket daging.</p>
            
            <div className="flex gap-2 mt-4">
              <Button asChild className="bg-white text-green-800 hover:bg-green-50 font-bold shadow-lg">
                <Link to="/shohibul/data">
                  <Plus className="h-4 w-4 mr-2" />
                  TAMBAH SHOHIBUL BARU
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                <Link to="/shohibul/payments">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  VALIDASI PENYERAHAN
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
            <Users size={180} />
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100/50 p-1">
            <TabsTrigger value="list" className="flex items-center gap-2 text-xs">
              <Users className="h-3 w-3" />
              Daftar Status
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2 text-xs">
              <LayoutGrid className="h-3 w-3" />
              Grup Sapi
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2 text-xs">
              <Calculator className="h-3 w-3" />
              Kalkulasi Daging
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <ShohibulStatusTable 
              data={shohibulStatusList}
              onUpdateStatus={updateStatus}
            />
          </TabsContent>
          
          <TabsContent value="groups" className="mt-0">
            <SapiKolektifGroups shohibulList={shohibulList} />
          </TabsContent>

          <TabsContent value="weight" className="mt-0">
            <AnimalWeightEntry />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ShohibulDashboard;
