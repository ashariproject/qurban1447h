import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ShohibulData {
  id: string;
  nama: string;
  alamat: string;
  noTelepon: string;
  jenisQurban: 'sapi-mandiri' | 'kambing-mandiri' | 'kambing-titip-beli' | 'sapi-patungan';
  jumlahHewan: number;
  pembayaran: {
    status: 'belum-bayar' | 'lunas' | 'cicil';
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
  fotoUrls: string[];
  createdAt: string;
}

interface AnimalData {
  totalSapi: number;
  totalKambing: number;
  sapiDisembelih: number;
  kambingDisembelih: number;
}

interface PackagingData {
  sapiPacksInput: number;
  kambingPacksInput: number;
  sapiPacksOutput: number;
  kambingPacksOutput: number;
}

interface QurbanContextType {
  animalData: AnimalData;
  packagingData: PackagingData;
  shohibulList: ShohibulData[];
  hewanList: HewanData[];
  updateAnimalData: (data: Partial<AnimalData>) => void;
  updatePackagingData: (data: Partial<PackagingData>) => void;
  addShohibul: (s: Omit<ShohibulData, 'id' | 'tanggalDaftar'>) => void;
  editShohibul: (id: string, s: Partial<ShohibulData>) => void;
  deleteShohibul: (id: string) => void;
  addFotoToHewan: (hewanId: string, dataUrl: string) => void;
  removeFotoFromHewan: (hewanId: string, idx: number) => void;
  updateHewanStatus: (hewanId: string, status: HewanData['status']) => void;
  resetAllData: () => void;
}

const QurbanContext = createContext<QurbanContextType | undefined>(undefined);

const initialAnimalData: AnimalData = {
  totalSapi: 12, totalKambing: 13, sapiDisembelih: 0, kambingDisembelih: 0,
};
const initialPackagingData: PackagingData = {
  sapiPacksInput: 0, kambingPacksInput: 0, sapiPacksOutput: 0, kambingPacksOutput: 0,
};
const initialShohibul: ShohibulData[] = [
  {
    id: '1', nama: 'Ahmad Susanto', alamat: 'Jl. Merdeka No. 123, Jakarta',
    noTelepon: '081234567890', jenisQurban: 'sapi-mandiri', jumlahHewan: 1,
    pembayaran: { status: 'lunas', jumlahDibayar: 18000000, totalBiaya: 18000000 },
    tanggalDaftar: '2024-01-15',
  },
  {
    id: '2', nama: 'Siti Nurhaliza', alamat: 'Jl. Sudirman No. 456, Bandung',
    noTelepon: '081987654321', jenisQurban: 'kambing-mandiri', jumlahHewan: 2,
    pembayaran: { status: 'cicil', jumlahDibayar: 2500000, totalBiaya: 5000000 },
    tanggalDaftar: '2024-01-16',
  },
];

const isSapi = (j: ShohibulData['jenisQurban']) => j.startsWith('sapi');

const generateHewanForShohibul = (s: ShohibulData, existingCount: { sapi: number; kambing: number }): HewanData[] => {
  const jenis: 'sapi' | 'kambing' = isSapi(s.jenisQurban) ? 'sapi' : 'kambing';
  const arr: HewanData[] = [];
  for (let i = 0; i < s.jumlahHewan; i++) {
    const seq = (jenis === 'sapi' ? ++existingCount.sapi : ++existingCount.kambing);
    arr.push({
      id: `${s.id}-${jenis}-${i}`,
      kode: `${jenis === 'sapi' ? 'SP' : 'KM'}${String(seq).padStart(3, '0')}`,
      jenis, shohibulId: s.id, status: 'diterima', fotoUrls: [],
      createdAt: new Date().toISOString(),
    });
  }
  return arr;
};

const buildInitialHewan = (list: ShohibulData[]): HewanData[] => {
  const counter = { sapi: 0, kambing: 0 };
  return list.flatMap(s => generateHewanForShohibul(s, counter));
};

const loadLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

export const QurbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animalData, setAnimalData] = useState<AnimalData>(() => loadLS('qurban_animalData', initialAnimalData));
  const [packagingData, setPackagingData] = useState<PackagingData>(() => loadLS('qurban_packagingData', initialPackagingData));
  const [shohibulList, setShohibulList] = useState<ShohibulData[]>(() => loadLS('qurban_shohibulList', initialShohibul));
  const [hewanList, setHewanList] = useState<HewanData[]>(() => loadLS('qurban_hewanList', buildInitialHewan(initialShohibul)));

  useEffect(() => { localStorage.setItem('qurban_animalData', JSON.stringify(animalData)); }, [animalData]);
  useEffect(() => { localStorage.setItem('qurban_packagingData', JSON.stringify(packagingData)); }, [packagingData]);
  useEffect(() => { localStorage.setItem('qurban_shohibulList', JSON.stringify(shohibulList)); }, [shohibulList]);
  useEffect(() => { localStorage.setItem('qurban_hewanList', JSON.stringify(hewanList)); }, [hewanList]);

  const updateAnimalData = (data: Partial<AnimalData>) => setAnimalData(p => ({ ...p, ...data }));
  const updatePackagingData = (data: Partial<PackagingData>) => setPackagingData(p => ({ ...p, ...data }));

  const addShohibul = (s: Omit<ShohibulData, 'id' | 'tanggalDaftar'>) => {
    const newS: ShohibulData = {
      ...s, id: Date.now().toString(),
      tanggalDaftar: new Date().toISOString().split('T')[0],
    };
    setShohibulList(prev => [...prev, newS]);
    setHewanList(prev => {
      const counter = {
        sapi: prev.filter(h => h.jenis === 'sapi').length,
        kambing: prev.filter(h => h.jenis === 'kambing').length,
      };
      return [...prev, ...generateHewanForShohibul(newS, counter)];
    });
  };

  const editShohibul = (id: string, data: Partial<ShohibulData>) => {
    setShohibulList(prev => prev.map(it => it.id === id ? { ...it, ...data } : it));
  };

  const deleteShohibul = (id: string) => {
    setShohibulList(prev => prev.filter(it => it.id !== id));
    setHewanList(prev => prev.filter(h => h.shohibulId !== id));
  };

  const addFotoToHewan = (hewanId: string, dataUrl: string) => {
    setHewanList(prev => prev.map(h => h.id === hewanId ? { ...h, fotoUrls: [...h.fotoUrls, dataUrl] } : h));
  };
  const removeFotoFromHewan = (hewanId: string, idx: number) => {
    setHewanList(prev => prev.map(h => h.id === hewanId ? { ...h, fotoUrls: h.fotoUrls.filter((_, i) => i !== idx) } : h));
  };
  const updateHewanStatus = (hewanId: string, status: HewanData['status']) => {
    setHewanList(prev => prev.map(h => h.id === hewanId ? { ...h, status } : h));
  };

  const resetAllData = () => {
    setAnimalData(initialAnimalData);
    setPackagingData(initialPackagingData);
    setShohibulList(initialShohibul);
    setHewanList(buildInitialHewan(initialShohibul));
  };

  return (
    <QurbanContext.Provider value={{
      animalData, packagingData, shohibulList, hewanList,
      updateAnimalData, updatePackagingData,
      addShohibul, editShohibul, deleteShohibul,
      addFotoToHewan, removeFotoFromHewan, updateHewanStatus,
      resetAllData,
    }}>
      {children}
    </QurbanContext.Provider>
  );
};

export const useQurban = () => {
  const ctx = useContext(QurbanContext);
  if (!ctx) throw new Error('useQurban must be used within a QurbanProvider');
  return ctx;
};
