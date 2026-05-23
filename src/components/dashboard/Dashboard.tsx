import React, { useState, useEffect } from 'react';
import ProgressCard from './ProgressCard';
import DistributionCard from './DistributionCard';
import { format } from 'date-fns';
import { useQurban } from '@/contexts/QurbanContext';
import { Beef, Zap, Truck, Activity } from 'lucide-react';
import DistributionEntryForm from './DistributionEntryForm';
import PackagingEntryForm from './PackagingEntryForm';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { animalData, packagingData, hewanList, shohibulList, distributionList } = useQurban();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // DYNAMIC CALCULATIONS from REAL DATA
  const totalSapi = hewanList.filter(h => h.jenis === 'sapi').length;
  const totalKambing = hewanList.filter(h => h.jenis === 'kambing').length;
  const totalHewan = totalSapi + totalKambing;

  const sapiDisembelih = hewanList.filter(h => h.jenis === 'sapi' && h.status !== 'diterima').length;
  const kambingDisembelih = hewanList.filter(h => h.jenis === 'kambing' && h.status !== 'diterima').length;
  const totalDisembelih = sapiDisembelih + kambingDisembelih;

  const totalPacksProduced = packagingData.sapiPacksOutput + packagingData.kambingPacksOutput;

  // Progress data for Sapi
  const progressDataSapi = {
    penyembelihan: { 
      current: sapiDisembelih, 
      total: totalSapi || 1, 
      bgColor: "bg-gradient-to-br from-red-500 to-red-600" 
    },
    pengemasan: { 
      current: packagingData.sapiPacksOutput, 
      total: packagingData.sapiPacksInput || 1, 
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600" 
    },
  };

  // Progress data for Kambing
  const progressDataKambing = {
    penyembelihan: { 
      current: kambingDisembelih, 
      total: totalKambing || 1, 
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600" 
    },
    pengemasan: { 
      current: packagingData.kambingPacksOutput, 
      total: packagingData.kambingPacksInput || 1, 
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600" 
    },
  };

  const shohibulSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi')).length;
  const shohibulKambing = shohibulList.filter(s => s.jenisQurban.startsWith('kambing')).length;
  
  const diterimaSapi = shohibulList.filter(s => s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;
  const diterimaKambing = shohibulList.filter(s => !s.jenisQurban.startsWith('sapi') && s.status?.telahTerima).length;

  const finalDistributionData = distributionList.map(item => {
    if (item.id === 'shohibul-sapi') {
      return { ...item, subtitle: `${shohibulSapi} Shohibul`, current: diterimaSapi, total: shohibulSapi };
    }
    if (item.id === 'shohibul-kambing') {
      return { ...item, subtitle: `${shohibulKambing} Shohibul`, current: diterimaKambing, total: shohibulKambing };
    }
    return item;
  });

  return (
    <div className="space-y-4">
      {/* Compact Date and Time Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm px-4 py-2 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
          <div>
            <h1 className="text-sm font-black text-gray-900 leading-tight flex items-center gap-2">
              DASHBOARD REAL-TIME
              <Activity className="h-3 w-3 text-blue-600 animate-pulse" />
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Monitoring Terpusat Panitia Qurban</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {format(currentTime, 'EEEE, dd MMM yyyy')}
          </div>
          <div className="text-sm font-black text-blue-600 leading-none">
            {format(currentTime, 'HH:mm:ss')}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column - Animal Summary & Progress */}
        <div className="lg:col-span-2 space-y-4">
          {/* Compact Animal Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL HEWAN</h3>
              <div className="text-2xl font-black text-blue-600 leading-none">{totalHewan}</div>
              <div className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Ekor Masuk</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 group hover:border-orange-200 transition-colors">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Beef className="h-3 w-3 text-orange-500" />
                SAPI
              </h3>
              <div className="text-2xl font-black text-orange-600 leading-none">{totalSapi}</div>
              <div className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Tersedia</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 group hover:border-green-200 transition-colors">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                KAMBING
              </h3>
              <div className="text-2xl font-black text-green-600 leading-none">{totalKambing}</div>
              <div className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Tersedia</div>
            </div>
          </div>

          {/* Progress Cards - Sapi & Kambing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sapi Progress */}
            <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-800 flex items-center gap-2 uppercase tracking-wider">
                <div className="h-1.5 w-1.5 bg-orange-500 rounded-full" />
                PROGRES SAPI
              </h3>
              <div className="space-y-3">
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
            <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-800 flex items-center gap-2 uppercase tracking-wider">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                PROGRES KAMBING
              </h3>
              <div className="space-y-3">
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
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700">
            <h3 className="text-[10px] font-black mb-4 text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-3 w-3" />
              STATISTIK OPERASIONAL LIVE
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <div className="text-xl font-black text-white">{totalHewan}</div>
                <div className="text-[8px] font-bold text-gray-400 uppercase">Input</div>
              </div>
              <div>
                <div className="text-xl font-black text-blue-400">
                  {totalHewan > 0 ? Math.round((totalDisembelih / totalHewan) * 100) : 0}%
                </div>
                <div className="text-[8px] font-bold text-gray-400 uppercase">Progres</div>
              </div>
              <div>
                <div className="text-xl font-black text-orange-400">{totalDisembelih}</div>
                <div className="text-[8px] font-bold text-gray-400 uppercase">Sembelih</div>
              </div>
              <div>
                <div className="text-xl font-black text-purple-400">{totalPacksProduced}</div>
                <div className="text-[8px] font-bold text-gray-400 uppercase">Kemas</div>
              </div>
              <div>
                <div className="text-xl font-black text-emerald-400">
                  {finalDistributionData.reduce((acc, curr) => acc + curr.current, 0)}
                </div>
                <div className="text-[8px] font-bold text-gray-400 uppercase">Kirim</div>
              </div>
            </div>
          </div>

          {/* New Distribution Entry Form */}
          <DistributionEntryForm />

          {/* New Packaging Entry Form */}
          <PackagingEntryForm />
        </div>

        {/* Right Column - Distribution */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-800 flex items-center gap-2 uppercase tracking-wider bg-gray-50 p-2 rounded-lg border border-gray-100">
            <Truck className="h-4 w-4 text-blue-600" />
            LIVE DISTRIBUSI
          </h3>
          <div className="space-y-2">
            {finalDistributionData.map((item, index) => (
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
