
import React, { useState, useEffect } from 'react';
import ProgressCard from './ProgressCard';
import DistributionCard from './DistributionCard';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulated packaging data that would be integrated from PackagingDataTable
  const packagingData = {
    totalPacksProduced: 35, // This would come from packaging officer input
    sapiPacks: 20,
    kambingPacks: 15
  };

  // Updated progress data with packaging integration
  const progressData = {
    penyembelihan: { current: 18, total: 25, bgColor: "bg-gradient-to-br from-red-500 to-red-600" },
    pengeletan: { current: 15, total: 25, bgColor: "bg-gradient-to-br from-orange-500 to-orange-600" },
    penimbangan: { current: packagingData.totalPacksProduced, total: 25, bgColor: "bg-gradient-to-br from-purple-500 to-purple-600" },
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

      {/* Progress Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">PROGRES QURBAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressCard 
            title="PENYEMBELIHAN" 
            current={progressData.penyembelihan.current} 
            total={progressData.penyembelihan.total}
            description={`Diselesaikan oleh petugas hewan: ${progressData.penyembelihan.current} dari ${progressData.penyembelihan.total} ekor`}
            bgColor={progressData.penyembelihan.bgColor}
          />
          <ProgressCard 
            title="PENGELETAN (Pemotongan Daging)" 
            current={progressData.pengeletan.current} 
            total={progressData.pengeletan.total}
            description={`Diproses oleh petugas hewan: ${progressData.pengeletan.current} dari ${progressData.pengeletan.total} hewan`}
            bgColor={progressData.pengeletan.bgColor}
          />
          <ProgressCard 
            title="PENIMBANGAN & PENGEMASAN" 
            current={progressData.penimbangan.current} 
            total={progressData.penimbangan.total}
            description={`Pack dikemas oleh petugas pengemasan: ${progressData.penimbangan.current} pack (${packagingData.sapiPacks} sapi + ${packagingData.kambingPacks} kambing)`}
            bgColor={progressData.penimbangan.bgColor}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {distributionData.reduce((acc, curr) => acc + curr.current, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Paket Terdistribusi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((distributionData.reduce((acc, curr) => acc + curr.current, 0) / distributionData.reduce((acc, curr) => acc + curr.total, 0)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Persentase Distribusi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {progressData.penyembelihan.current}
            </div>
            <div className="text-sm text-gray-600">Hewan Disembelih</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {progressData.penimbangan.current}
            </div>
            <div className="text-sm text-gray-600">Paket Dikemas</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
