
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  updateAnimalData: (data: Partial<AnimalData>) => void;
  updatePackagingData: (data: Partial<PackagingData>) => void;
  resetAllData: () => void;
}

const QurbanContext = createContext<QurbanContextType | undefined>(undefined);

const initialAnimalData: AnimalData = {
  totalSapi: 12,
  totalKambing: 13,
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
  const [animalData, setAnimalData] = useState<AnimalData>(initialAnimalData);
  const [packagingData, setPackagingData] = useState<PackagingData>(initialPackagingData);

  const updateAnimalData = (data: Partial<AnimalData>) => {
    setAnimalData(prev => ({ ...prev, ...data }));
  };

  const updatePackagingData = (data: Partial<PackagingData>) => {
    setPackagingData(prev => ({ ...prev, ...data }));
  };

  const resetAllData = () => {
    setAnimalData(initialAnimalData);
    setPackagingData(initialPackagingData);
  };

  return (
    <QurbanContext.Provider value={{
      animalData,
      packagingData,
      updateAnimalData,
      updatePackagingData,
      resetAllData,
    }}>
      {children}
    </QurbanContext.Provider>
  );
};

export const useQurban = () => {
  const context = useContext(QurbanContext);
  if (context === undefined) {
    throw new Error('useQurban must be used within a QurbanProvider');
  }
  return context;
};
