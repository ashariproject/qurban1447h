
import React, { useState, useEffect } from 'react';
import ProgressCard from './ProgressCard';
import DistributionCard from './DistributionCard';
import { format } from 'date-fns';
import { useQurban } from '@/contexts/QurbanContext';
import { Beef, Zap } from 'lucide-react';

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
      title: "SHOHIBUL SAPI", 
      subtitle: "21 Shohibul",
      current: 16, 
      total: 21,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    { 
      title: "SHOHIBUL KAMBING", 
      subtitle: "12 Shohibul",
      current: 10, 
      total: 12,
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    },
    { 
      title: "PANTAI MENTARI", 
      subtitle: "180 KK",
      current: 45, 
      total: 180,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600"
    },
    { 
      title: "KOMPLEK AL", 
      subtitle: "25 KK",
      current: 18, 
      total: 25,
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600"
    },
    { 
      title: "WARGA LAIN", 
      subtitle: "600 KK",
      current: 125, 
      total: 600,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="space-y-4 h-screen overflow-hidden">
      {/* Date and Time Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard Qurban Real-Time</h1>
            <p className="text-gray-600 text-sm">Monitoring langsung dari input petugas lapangan</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <div className="text-sm font-semibold text-gray-900">
              {format(currentTime, 'EEEE, dd MMMM yyyy')}
            </div>
            <div className="text-lg font-bold text-blue-600">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
        
        {/* Left Column - Animal Summary & Progress */}
        <div className="lg:col-span-2 space-y-4">
          {/* Animal Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-3 shadow-lg">
              <h3 className="text-sm font-semibold mb-1">TOTAL HEWAN</h3>
              <div className="text-2xl font-bold">{totalHewan}</div>
              <div className="text-blue-100 text-xs">Sapi + Kambing</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-3 shadow-lg">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                <Beef className="h-4 w-4" />
                SAPI
              </h3>
              <div className="text-2xl font-bold">{animalData.totalSapi}</div>
              <div className="text-orange-100 text-xs">Ekor Sapi</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-3 shadow-lg">
              <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                <Zap className="h-4 w-4" />
                KAMBING
              </h3>
              <div className="text-2xl font-bold">{animalData.totalKambing}</div>
              <div className="text-green-100 text-xs">Ekor Kambing</div>
            </div>
          </div>

          {/* Progress Cards - Sapi & Kambing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sapi Progress */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <Beef className="h-4 w-4" />
                PROGRES SAPI
              </h3>
              <div className="space-y-2">
                <ProgressCard 
                  title="SEMBELIH" 
                  current={progressDataSapi.penyembelihan.current} 
                  total={progressDataSapi.penyembelihan.total}
                  description={`${progressDataSapi.penyembelihan.current}/${progressDataSapi.penyembelihan.total} ekor`}
                  bgColor={progressDataSapi.penyembelihan.bgColor}
                  icon={Beef}
                />
                <ProgressCard 
                  title="KEMAS" 
                  current={progressDataSapi.pengemasan.current} 
                  total={progressDataSapi.pengemasan.total}
                  description={`${progressDataSapi.pengemasan.current}/${progressDataSapi.pengemasan.total} pack`}
                  bgColor={progressDataSapi.pengemasan.bgColor}
                  icon={Beef}
                />
              </div>
            </div>

            {/* Kambing Progress */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <Zap className="h-4 w-4" />
                PROGRES KAMBING
              </h3>
              <div className="space-y-2">
                <ProgressCard 
                  title="SEMBELIH" 
                  current={progressDataKambing.penyembelihan.current} 
                  total={progressDataKambing.penyembelihan.total}
                  description={`${progressDataKambing.penyembelihan.current}/${progressDataKambing.penyembelihan.total} ekor`}
                  bgColor={progressDataKambing.penyembelihan.bgColor}
                  icon={Zap}
                />
                <ProgressCard 
                  title="KEMAS" 
                  current={progressDataKambing.pengemasan.current} 
                  total={progressDataKambing.pengemasan.total}
                  description={`${progressDataKambing.pengemasan.current}/${progressDataKambing.pengemasan.total} pack`}
                  bgColor={progressDataKambing.pengemasan.bgColor}
                  icon={Zap}
                />
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-2 text-gray-800">RINGKASAN STATISTIK</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{totalHewan}</div>
                <div className="text-xs text-gray-600">Total Hewan</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {totalHewan > 0 ? Math.round((totalDisembelih / totalHewan) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-600">Diproses</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{totalDisembelih}</div>
                <div className="text-xs text-gray-600">Disembelih</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{totalPacksProduced}</div>
                <div className="text-xs text-gray-600">Dikemas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {distributionData.reduce((acc, curr) => acc + curr.current, 0)}
                </div>
                <div className="text-xs text-gray-600">Terdistribusi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Distribution */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">DISTRIBUSI QURBAN</h3>
          <div className="space-y-2 h-full overflow-y-auto">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
