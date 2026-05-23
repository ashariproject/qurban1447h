import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from "@/hooks/use-toast";

export interface ShohibulData {
  id: string;
  nama: string;
  alamat: string;
  noTelepon: string;
  jenisQurban: 'sapi-patungan' | 'sapi-mandiri' | 'kambing-titip-beli' | 'kambing-mandiri';
  jumlahHewan: number;
  status: {
    datang: boolean;
    siapSembelih: boolean;
    siapKirim: boolean;
    telahTerima: boolean;
  };
  pembayaran: {
    status: 'lunas' | 'lunas-sebagian' | 'belum-lunas' | 'lunas-cash';
    jumlahDibayar: number;
    totalBiaya: number;
  };
  tanggalDaftar: string;
}

export interface HewanData {
  id: string;
  kode: string;
  jenis: 'sapi' | 'kambing';
  shohibulId: string;
  status: 'diterima' | 'disembelih' | 'dipotong';
  bobot?: number;
  lingkarDada?: number;
  beratKarkas?: number;
  beratDaging?: number;
  fotoUrls: string[];
  createdAt: string;
}

export interface AnimalData {
  totalSapi: number;
  totalKambing: number;
  sapiDisembelih: number;
  kambingDisembelih: number;
}

export interface PackagingData {
  sapiPacksInput: number;
  kambingPacksInput: number;
  sapiPacksOutput: number;
  kambingPacksOutput: number;
}

export interface DistributionData {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  total: number;
  bgColor: string;
}

interface QurbanContextType {
  shohibulList: ShohibulData[];
  hewanList: HewanData[];
  animalData: AnimalData;
  packagingData: PackagingData;
  distributionList: DistributionData[];
  isLoading: boolean;
  addShohibul: (s: Omit<ShohibulData, 'id' | 'tanggalDaftar'>) => Promise<void>;
  editShohibul: (id: string, s: Partial<ShohibulData>) => Promise<void>;
  deleteShohibul: (id: string) => Promise<void>;
  updateShohibulStatus: (id: string, field: string, value: any) => Promise<void>;
  updateHewanStatus: (id: string, status: HewanData['status']) => Promise<void>;
  updateDistribution: (id: string, data: Partial<DistributionData>) => Promise<void>;
  updateHewanMeasurements: (id: string, measurements: { bobot?: number, lingkarDada?: number }) => Promise<void>;
  addFotoToHewan: (id: string, url: string) => Promise<void>;
  removeFotoFromHewan: (id: string, index: number) => Promise<void>;
  updatePackagingData: (data: Partial<PackagingData>) => Promise<void>;
  fetchData: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const QurbanContext = createContext<QurbanContextType | undefined>(undefined);

export const useQurban = () => {
  const context = useContext(QurbanContext);
  if (!context) throw new Error('useQurban must be used within a QurbanProvider');
  return context;
};

const initialAnimalData: AnimalData = {
  totalSapi: 0,
  totalKambing: 0,
  sapiDisembelih: 0,
  kambingDisembelih: 0,
};

const initialPackagingData: PackagingData = {
  sapiPacksInput: 0,
  kambingPacksInput: 0,
  sapiPacksOutput: 0,
  kambingPacksOutput: 0,
};

export const QurbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [shohibulList, setShohibulList] = useState<ShohibulData[]>([]);
  const [hewanList, setHewanList] = useState<HewanData[]>([]);
  const [animalData, setAnimalData] = useState<AnimalData>(initialAnimalData);
  const [packagingData, setPackagingData] = useState<PackagingData>(initialPackagingData);
  const [distributionList, setDistributionList] = useState<DistributionData[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [shohibulRes, hewanRes, packagingRes, distRes] = await Promise.all([
        supabase.from('shohibul').select('*'),
        supabase.from('hewan').select('*'),
        supabase.from('packaging').select('*').eq('id', 'main').single(),
        supabase.from('distribution').select('*').order('id')
      ]);

      if (shohibulRes.data) setShohibulList(shohibulRes.data);
      if (hewanRes.data) setHewanList(hewanRes.data);
      if (packagingRes.data) {
        setPackagingData({
          sapiPacksInput: packagingRes.data.sapiPacksInput || 0,
          kambingPacksInput: packagingRes.data.kambingPacksInput || 0,
          sapiPacksOutput: packagingRes.data.sapiPacksOutput || 0,
          kambingPacksOutput: packagingRes.data.kambingPacksOutput || 0,
        });
      }
      if (distRes.data) setDistributionList(distRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ variant: "destructive", title: "Error sinkronisasi data" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute derived state
  useEffect(() => {
    const sapiMandiri = shohibulList.filter(s => s.jenisQurban === 'sapi-mandiri').length;
    const sapiPatungan = shohibulList.filter(s => s.jenisQurban === 'sapi-patungan').length;
    const totalSapiCount = sapiMandiri + Math.ceil(sapiPatungan / 7);
    const totalKambingCount = shohibulList.filter(s => s.jenisQurban.startsWith('kambing')).reduce((acc, curr) => acc + curr.jumlahHewan, 0);

    const sapiDisembelih = hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima').length;
    const kambingDisembelih = hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima').length;

    setAnimalData({
      totalSapi: totalSapiCount,
      totalKambing: totalKambingCount,
      sapiDisembelih,
      kambingDisembelih
    });

    const totalMeatSapi = hewanList.filter(h => h.jenis === 'sapi').reduce((acc, h) => acc + (h.beratDaging || 0), 0);
    const totalMeatKambing = hewanList.filter(h => h.jenis === 'kambing').reduce((acc, h) => acc + (h.beratDaging || 0), 0);

    setPackagingData(prev => ({
      ...prev,
      sapiPacksInput: totalMeatSapi > 0 ? Math.round(totalMeatSapi) : prev.sapiPacksInput,
      kambingPacksInput: totalMeatKambing > 0 ? Math.round(totalMeatKambing) : prev.kambingPacksInput,
    }));

    setDistributionList(prev => prev.map(d => {
      if (d.id === 'shohibul-sapi') {
        const total = shohibulList.filter(s => s.jenisQurban.startsWith('sapi')).length;
        return { ...d, total, subtitle: `${total} Shohibul` };
      }
      if (d.id === 'shohibul-kambing') {
        const total = shohibulList.filter(s => s.jenisQurban.startsWith('kambing')).length;
        return { ...d, total, subtitle: `${total} Shohibul` };
      }
      return d;
    }));
  }, [shohibulList, hewanList]);

  const addShohibul = async (s: Omit<ShohibulData, 'id' | 'tanggalDaftar'>) => {
    const newId = crypto.randomUUID();
    const newS = { ...s, id: newId, tanggalDaftar: new Date().toISOString().split('T')[0] };
    
    // Optimistic Update
    setShohibulList(prev => [...prev, newS as ShohibulData]);
    
    const { error } = await supabase.from('shohibul').insert([newS]);
    if (error) {
      toast({ variant: "destructive", title: "Gagal menyimpan" });
      fetchData(); // revert
    }
  };

  const editShohibul = async (id: string, data: Partial<ShohibulData>) => {
    setShohibulList(prev => prev.map(it => it.id === id ? { ...it, ...data } : it));
    
    const { error } = await supabase.from('shohibul').update(data).eq('id', id);
    if (error) {
      toast({ variant: "destructive", title: "Gagal memperbarui" });
      fetchData();
    }
  };
  
  const deleteShohibul = async (id: string) => {
    setShohibulList(prev => prev.filter(it => it.id !== id));
    setHewanList(prev => prev.filter(h => h.shohibulId !== id));
    
    const { error } = await supabase.from('shohibul').delete().eq('id', id);
    if (error) {
      toast({ variant: "destructive", title: "Gagal menghapus" });
      fetchData();
    }
  };

  const updateShohibulStatus = async (id: string, field: string, value: any) => {
    const shohibul = shohibulList.find(s => s.id === id);
    if (!shohibul) return;

    const newStatus = { ...shohibul.status, [field]: value };
    
    setShohibulList(prev => prev.map(s => {
      if (s.id === id) {
        if (field === 'telahTerima') {
          const isSapi = s.jenisQurban.startsWith('sapi');
          const distId = isSapi ? 'shohibul-sapi' : 'shohibul-kambing';
          setDistributionList(dPrev => dPrev.map(d => d.id === distId ? { ...d, current: Math.max(0, d.current + (value ? 1 : -1)) } : d));
        }
        return { ...s, status: newStatus };
      }
      return s;
    }));

    const { error } = await supabase.from('shohibul').update({ status: newStatus }).eq('id', id);
    if (error) fetchData();
  };

  const updateHewanStatus = async (id: string, status: HewanData['status']) => {
    setHewanList(prev => prev.map(h => h.id === id ? { ...h, status } : h));
    const { error } = await supabase.from('hewan').update({ status }).eq('id', id);
    if (error) fetchData();
  };

  const updateHewanMeasurements = async (id: string, measurements: { bobot?: number, lingkarDada?: number }) => {
    const hewan = hewanList.find(h => h.id === id);
    if (!hewan) return;

    let finalBobot = measurements.bobot || hewan.bobot || 0;
    let finalLD = measurements.lingkarDada || hewan.lingkarDada || 0;
    if (hewan.jenis === 'sapi' && finalLD > 0 && !measurements.bobot) finalBobot = Math.pow(finalLD + 22, 2) / 100;
    
    let ratio = hewan.jenis === 'sapi' ? 0.38 : 0.356;
    const beratDaging = Math.round(finalBobot * ratio * 10) / 10;

    const updates = { bobot: finalBobot, lingkarDada: finalLD, beratDaging };

    setHewanList(prev => prev.map(h => {
      if (h.id === id) return { ...h, ...updates };
      return h;
    }));

    const { error } = await supabase.from('hewan').update(updates).eq('id', id);
    if (error) fetchData();
  };

  const addFotoToHewan = async (id: string, url: string) => {
    const hewan = hewanList.find(h => h.id === id);
    if (!hewan) return;
    const newFotoUrls = [...(hewan.fotoUrls || []), url];

    setHewanList(prev => prev.map(h => h.id === id ? { ...h, fotoUrls: newFotoUrls } : h));
    const { error } = await supabase.from('hewan').update({ fotoUrls: newFotoUrls }).eq('id', id);
    if (error) fetchData();
  };

  const removeFotoFromHewan = async (id: string, idx: number) => {
    const hewan = hewanList.find(h => h.id === id);
    if (!hewan) return;
    const newFotoUrls = (hewan.fotoUrls || []).filter((_, i) => i !== idx);

    setHewanList(prev => prev.map(h => h.id === id ? { ...h, fotoUrls: newFotoUrls } : h));
    const { error } = await supabase.from('hewan').update({ fotoUrls: newFotoUrls }).eq('id', id);
    if (error) fetchData();
  };

  const updatePackagingData = async (data: Partial<PackagingData>) => {
    setPackagingData(p => ({ ...p, ...data }));
    
    // In database, we use camelCase columns matching the interface, but we need to map them properly
    // if the schema uses double quotes (which it does). Supabase JS handles this if names match.
    const { error } = await supabase.from('packaging').update(data).eq('id', 'main');
    if (error) fetchData();
  };

  const updateDistribution = async (id: string, data: Partial<DistributionData>) => {
    setDistributionList(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    const { error } = await supabase.from('distribution').update(data).eq('id', id);
    if (error) fetchData();
  };

  const resetAllData = async () => {
    try {
      setIsLoading(true);
      
      // Delete all shohibul and hewan
      const { error: errorHewan } = await supabase.from('hewan').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errorHewan) console.error("Error resetting hewan:", errorHewan);
      
      const { error: errorShohibul } = await supabase.from('shohibul').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errorShohibul) console.error("Error resetting shohibul:", errorShohibul);

      // Reset packaging
      const { error: errorPack } = await supabase.from('packaging').update({
        sapiPacksInput: 0,
        kambingPacksInput: 0,
        sapiPacksOutput: 0,
        kambingPacksOutput: 0
      }).eq('id', 'main');
      if (errorPack) console.error("Error resetting packaging:", errorPack);

      // Reset distribution
      const { error: errorDist } = await supabase.from('distribution').update({
        current: 0
      }).neq('id', '00000000-0000-0000-0000-000000000000');
      if (errorDist) console.error("Error resetting distribution:", errorDist);

      toast({
        title: "Database Direset",
        description: "Semua data qurban telah dibersihkan.",
      });

      await fetchData();
    } catch (err: any) {
      console.error("Reset error:", err);
      toast({
        variant: "destructive",
        title: "Gagal Reset Data",
        description: err.message || "Terjadi kesalahan koneksi database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QurbanContext.Provider value={{
      shohibulList, hewanList, animalData, packagingData, distributionList, isLoading,
      addShohibul, editShohibul, deleteShohibul, updateShohibulStatus,
      updateHewanStatus, updateDistribution, updateHewanMeasurements,
      addFotoToHewan, removeFotoFromHewan, updatePackagingData, fetchData, resetAllData
    }}>
      {children}
    </QurbanContext.Provider>
  );
};
