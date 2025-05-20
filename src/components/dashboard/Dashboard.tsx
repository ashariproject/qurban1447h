
import React from 'react';
import ProgressCard from './ProgressCard';
import DistributionCard from './DistributionCard';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Progress Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PROGRES QURBAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressCard 
            title="PENYEMBELIHAN" 
            current={20} 
            total={25}
            description="Jumlah disembelih: 20 dari 25 ekor" 
          />
          <ProgressCard 
            title="PENGELETAN (Pemotongan Daging)" 
            current={18} 
            total={25}
            description="Jumlah digelet: 18 dari 25 hewan" 
          />
          <ProgressCard 
            title="PENIMBANGAN" 
            current={25} 
            total={25}
            description="Semua hewan sudah ditimbang" 
          />
        </div>
      </section>

      {/* Distribution Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">DISTRIBUSI QURBAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DistributionCard 
            title="SHOHIBUL QURBAN SAPI" 
            subtitle="Jumlah Shohibul: 21"
            current={18} 
            total={21} 
          />
          <DistributionCard 
            title="SHOHIBUL QURBAN KAMBING" 
            subtitle="Jumlah Shohibul: 12"
            current={12} 
            total={12} 
          />
          <DistributionCard 
            title="WARGA PANTAI MENTARI" 
            subtitle="Target: 180 KK"
            current={60} 
            total={180} 
          />
          <DistributionCard 
            title="WARGA AL" 
            subtitle="Jumlah: 25"
            current={25} 
            total={25} 
          />
          <DistributionCard 
            title="WARGA LAIN" 
            subtitle="Jumlah: 600"
            current={200} 
            total={600} 
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
