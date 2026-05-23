import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Beef, Package, Truck, Users, Activity } from "lucide-react";
import { useQurban } from '@/contexts/QurbanContext';

const Monitoring = () => {
  const { shohibulList, hewanList, animalData, packagingData, distributionList } = useQurban();

  // DYNAMIC CALCULATIONS FOR SHOHIBUL DISTRIBUTION
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

  // 1. Calculate Progress Stage Data from REAL Context
  const totalTarget = 200; // Estimated target for UI baseline
  const stageData = [
    { 
      name: 'Registrasi', 
      completed: shohibulList.length, 
      total: totalTarget 
    },
    { 
      name: 'Penerimaan', 
      completed: hewanList.length, 
      total: animalData.totalSapi + animalData.totalKambing 
    },
    { 
      name: 'Penyembelihan', 
      completed: hewanList.filter(h => h.status === 'disembelih' || h.status === 'dipotong').length, 
      total: hewanList.length || 1
    },
    { 
      name: 'Pengemasan', 
      completed: packagingData.sapiPacksOutput + packagingData.kambingPacksOutput, 
      total: (packagingData.sapiPacksInput + packagingData.kambingPacksInput) || 1000
    },
    { 
      name: 'Distribusi', 
      completed: finalDistributionData.reduce((acc, curr) => acc + curr.current, 0), 
      total: finalDistributionData.reduce((acc, curr) => acc + curr.total, 0) || 1
    },
  ];

  // 2. Animal Types Distribution
  const qurbanTypes = [
    { name: 'Sapi', value: hewanList.filter(h => h.jenis === 'sapi').length },
    { name: 'Kambing', value: hewanList.filter(h => h.jenis === 'kambing').length },
  ];

  // 3. Shohibul Status
  const shohibulData = [
    { status: 'Lunas', count: shohibulList.filter(s => s.pembayaran.status.startsWith('lunas')).length },
    { status: 'Belum Lunas', count: shohibulList.filter(s => !s.pembayaran.status.startsWith('lunas')).length },
  ];

  // 4. Distribution Areas
  const distributionData = finalDistributionData.map(d => ({
    area: d.title,
    delivered: d.current,
    pending: Math.max(0, d.total - d.current)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const calculatePercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const statusCards = [
    { 
      title: "Shohibul", 
      count: shohibulList.length,
      icon: Users,
      color: "bg-blue-600"
    },
    { 
      title: "Hewan Diterima", 
      count: hewanList.length,
      icon: Beef,
      color: "bg-emerald-600" 
    },
    { 
      title: "Paket Dikemas", 
      count: packagingData.sapiPacksOutput + packagingData.kambingPacksOutput,
      icon: Package,
      color: "bg-amber-600" 
    },
    { 
      title: "Terdistribusi", 
      count: finalDistributionData.reduce((acc, curr) => acc + curr.current, 0),
      icon: Truck,
      color: "bg-purple-600" 
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Activity className="text-blue-600 h-6 w-6" />
              MONITORING REAL-TIME
            </h1>
            <p className="text-sm text-gray-500 font-medium">Sinkronisasi data otomatis dari semua pos petugas lapangan.</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 text-[10px] font-black uppercase">
            LIVE UPDATE
          </Badge>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map((card, index) => (
            <Card key={index} className="border-none shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="flex items-center p-4 relative">
                <div className={`${card.color} p-3 rounded-xl mr-4 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                  <card.icon className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
                  <p className="text-2xl font-black text-gray-800">{card.count}</p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1 opacity-20" style={{ backgroundColor: card.color }}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different monitoring views */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-100/50 p-1 rounded-xl border border-gray-100">
            <TabsTrigger value="progress" className="rounded-lg font-bold text-xs uppercase">Progres Tahapan</TabsTrigger>
            <TabsTrigger value="animals" className="rounded-lg font-bold text-xs uppercase">Stok Hewan</TabsTrigger>
            <TabsTrigger value="distribution" className="rounded-lg font-bold text-xs uppercase">Distribusi</TabsTrigger>
          </TabsList>
          
          {/* Progress Tab */}
          <TabsContent value="progress" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-none shadow-xl">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg font-black text-gray-800">PIPELINE OPERASIONAL</CardTitle>
                <CardDescription className="text-xs font-medium">Status penyelesaian dari pendaftaran hingga paket terkirim</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any, name: string) => [value, name === "completed" ? "Selesai" : "Total"]} 
                      />
                      <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="completed" />
                      <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} name="total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
                  {stageData.map((stage, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{stage.name}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-lg font-black text-gray-800 leading-none">{stage.completed}</p>
                        <Badge className={`text-[9px] font-black border-none h-5 ${
                          calculatePercentage(stage.completed, stage.total) >= 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {calculatePercentage(stage.completed, stage.total)}%
                        </Badge>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-1000" 
                          style={{ width: `${Math.min(100, calculatePercentage(stage.completed, stage.total))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Animals Tab */}
          <TabsContent value="animals" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-none shadow-xl">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg font-black text-gray-800">REKAPITULASI HEWAN</CardTitle>
                <CardDescription className="text-xs font-medium">Distribusi dan status kesehatan stok hewan qurban</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qurbanTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {qurbanTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {qurbanTypes.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        <span className="text-xs font-bold text-gray-600 uppercase">{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 mt-8 md:mt-0 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Total Hewan</p>
                      <h4 className="text-3xl font-black text-emerald-800">{hewanList.length} <span className="text-sm font-bold">EKOR</span></h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Diterima</p>
                        <h4 className="text-xl font-black text-blue-800">{hewanList.filter(h => h.status === 'diterima').length}</h4>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <p className="text-[10px] font-black text-orange-600 uppercase mb-1">Disembelih</p>
                        <h4 className="text-xl font-black text-orange-800">{hewanList.filter(h => h.status !== 'diterima').length}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Distribution Tab */}
          <TabsContent value="distribution" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-none shadow-xl">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg font-black text-gray-800">EFEKTIVITAS DISTRIBUSI</CardTitle>
                <CardDescription className="text-xs font-medium">Monitoring penyaluran daging ke berbagai wilayah target</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis dataKey="area" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={100} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any, name: string) => [value + " pkt", name === "delivered" ? "Terkirim" : "Sisa"]} 
                      />
                      <Bar dataKey="delivered" fill="#10b981" radius={[0, 4, 4, 0]} name="delivered" barSize={20} />
                      <Bar dataKey="pending" fill="#fef3c7" radius={[0, 4, 4, 0]} name="pending" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Paket</p>
                    <p className="text-2xl font-black text-gray-800">
                      {finalDistributionData.reduce((acc, curr) => acc + curr.total, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-green-600 uppercase mb-1">Terkirim</p>
                    <p className="text-2xl font-black text-green-600">
                      {finalDistributionData.reduce((acc, curr) => acc + curr.current, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Efisiensi</p>
                    <p className="text-2xl font-black text-amber-600">
                      {calculatePercentage(
                        finalDistributionData.reduce((acc, curr) => acc + curr.current, 0),
                        finalDistributionData.reduce((acc, curr) => acc + curr.total, 0)
                      )}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Monitoring;
