
import React, { useState, useEffect } from 'react';
import ProgressCard from './ProgressCard';
import DistributionCard from './DistributionCard';
import { format } from 'date-fns';
import { useQurban } from '@/contexts/QurbanContext';
import { Beef, Cat } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { animalData, packagingData } = useQurban();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate total values
  const totalHewan = animalData.totalSapi + animalData.totalKambing;
  const totalDisembelih = animalData.sapiDisembelih + animalData.kambingDisembelih;
  const totalPacksProduced = packagingData.sapiPacksOutput + packagingData.kambingPacksOutput;

  // Progress data for Sapi
  const progressDataSapi = {
    penyembelihan: { 
      current: animalData.sapiDisembelih, 
      total: animalData.totalSapi, 
      bgColor: "bg-gradient-to-br from-red-500 to-red-600" 
    },
    pengemasan: { 
      current: packagingData.sapiPacksOutput, 
      total: packagingData.sapiPacksInput, 
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600" 
    },
  };

  // Progress data for Kambing
  const progressDataKambing = {
    penyembelihan: { 
      current: animalData.kambingDisembelih, 
      total: animalData.totalKambing, 
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600" 
    },
    pengemasan: { 
      current: packagingData.kambingPacksOutput, 
      total: packagingData.kambingPacksInput, 
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600" 
    },
  };

  const distributionData = [
    { 
      title: "SHOHIBUL QURBAN SAPI", 
      subtitle: "Jumlah Shohibul: 21",
      current: 16, 
      total: 21,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    { 
      title: "SHOHIBUL QURBAN KAMBING", 
      subtitle: "Jumlah Shohibul: 12",
      current: 10, 
      total: 12,
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    },
    { 
      title: "WARGA PANTAI MENTARI", 
      subtitle: "Target: 180 KK (6 Sektor)",
      current: 45, 
      total: 180,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600"
    },
    { 
      title: "WARGA KOMPLEK AL", 
      subtitle: "Target: 25 KK (4 Gang)",
      current: 18, 
      total: 25,
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600"
    },
    { 
      title: "WARGA LAIN", 
      subtitle: "Jumlah: 600 KK",
      current: 125, 
      total: 600,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Date and Time Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Qurban Real-Time</h1>
            <p className="text-gray-600 mt-1">Monitoring langsung dari input petugas lapangan</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-lg font-semibold text-gray-900">
              {format(currentTime, 'EEEE, dd MMMM yyyy')}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>
        </div>
      </div>

      {/* Animal Summary Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">TOTAL HEWAN QURBAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">TOTAL HEWAN</h3>
            <div className="text-4xl font-bold">{totalHewan}</div>
            <div className="text-blue-100 text-sm mt-2">Sapi + Kambing</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Beef className="h-6 w-6" />
              HEWAN SAPI
            </h3>
            <div className="text-4xl font-bold">{animalData.totalSapi}</div>
            <div className="text-orange-100 text-sm mt-2">Ekor Sapi Qurban</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Cat className="h-6 w-6" />
              HEWAN KAMBING
            </h3>
            <div className="text-4xl font-bold">{animalData.totalKambing}</div>
            <div className="text-green-100 text-sm mt-2">Ekor Kambing Qurban</div>
          </div>
        </div>
      </section>

      {/* Progress Section - Sapi */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Beef className="h-6 w-6" />
          PROGRES QURBAN SAPI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProgressCard 
            title="PENYEMBELIHAN SAPI" 
            current={progressDataSapi.penyembelihan.current} 
            total={progressDataSapi.penyembelihan.total}
            description={`Diselesaikan: ${progressDataSapi.penyembelihan.current} dari ${progressDataSapi.penyembelihan.total} ekor sapi`}
            bgColor={progressDataSapi.penyembelihan.bgColor}
            icon={Beef}
          />
          <ProgressCard 
            title="PENGEMASAN SAPI" 
            current={progressDataSapi.pengemasan.current} 
            total={progressDataSapi.pengemasan.total}
            description={`Pack dikemas: ${progressDataSapi.pengemasan.current} dari ${progressDataSapi.pengemasan.total} pack daging sapi`}
            bgColor={progressDataSapi.pengemasan.bgColor}
            icon={Beef}
          />
        </div>
      </section>

      {/* Progress Section - Kambing */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Cat className="h-6 w-6" />
          PROGRES QURBAN KAMBING
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProgressCard 
            title="PENYEMBELIHAN KAMBING" 
            current={progressDataKambing.penyembelihan.current} 
            total={progressDataKambing.penyembelihan.total}
            description={`Diselesaikan: ${progressDataKambing.penyembelihan.current} dari ${progressDataKambing.penyembelihan.total} ekor kambing`}
            bgColor={progressDataKambing.penyembelihan.bgColor}
            icon={Cat}
          />
          <ProgressCard 
            title="PENGEMASAN KAMBING" 
            current={progressDataKambing.pengemasan.current} 
            total={progressDataKambing.pengemasan.total}
            description={`Pack dikemas: ${progressDataKambing.pengemasan.current} dari ${progressDataKambing.pengemasan.total} pack daging kambing`}
            bgColor={progressDataKambing.pengemasan.bgColor}
            icon={Cat}
          />
        </div>
      </section>

      {/* Distribution Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">DISTRIBUSI QURBAN</h2>
        <p className="text-sm text-gray-600 mb-4">Data berdasarkan input petugas distribusi</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {distributionData.map((item, index) => (
            <DistributionCard 
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              current={item.current} 
              total={item.total}
              bgColor={item.bgColor}
            />
          ))}
        </div>
      </section>

      {/* Summary Statistics */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">RINGKASAN STATISTIK</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalHewan}
            </div>
            <div className="text-sm text-gray-600">Total Hewan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalHewan > 0 ? Math.round((totalDisembelih / totalHewan) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Hewan Diproses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalDisembelih}
            </div>
            <div className="text-sm text-gray-600">Hewan Disembelih</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalPacksProduced}
            </div>
            <div className="text-sm text-gray-600">Paket Dikemas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {distributionData.reduce((acc, curr) => acc + curr.current, 0)}
            </div>
            <div className="text-sm text-gray-600">Paket Terdistribusi</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
