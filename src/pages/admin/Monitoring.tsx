import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Beef, Package, Truck, Users } from "lucide-react";

const Monitoring = () => {
  // Dummy data for demonstration
  const stageData = [
    { name: 'Registrasi', completed: 120, total: 150 },
    { name: 'Penerimaan Hewan', completed: 100, total: 150 },
    { name: 'Penyembelihan', completed: 85, total: 150 },
    { name: 'Pengemasan', completed: 70, total: 150 },
    { name: 'Distribusi', completed: 50, total: 150 },
  ];

  const qurbanTypes = [
    { name: 'Sapi Utuh', value: 15 },
    { name: 'Sapi Patungan', value: 95 },
    { name: 'Kambing', value: 40 },
  ];

  const shohibulData = [
    { status: 'Terdaftar', count: 150 },
    { status: 'Terkonfirmasi', count: 130 },
    { status: 'Menunggu Pembayaran', count: 20 },
  ];

  const distributionData = [
    { area: 'Pantai Mentari', delivered: 20, pending: 30 },
    { area: 'Sukolilo', delivered: 15, pending: 25 },
    { area: 'Gunung Anyar', delivered: 10, pending: 20 },
    { area: 'Rungkut', delivered: 5, pending: 15 },
    { area: 'Lainnya', delivered: 0, pending: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calculate percentages for status cards
  const calculatePercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  // Create status cards based on stages
  const statusCards = [
    { 
      title: "Shohibul Qurban", 
      count: shohibulData.reduce((acc, curr) => acc + curr.count, 0),
      icon: Users,
      color: "bg-blue-500"
    },
    { 
      title: "Hewan Qurban", 
      count: qurbanTypes.reduce((acc, curr) => acc + curr.value, 0),
      icon: Beef,
      color: "bg-green-500" 
    },
    { 
      title: "Paket Dikemas", 
      count: stageData[3].completed,
      icon: Package,
      color: "bg-yellow-500" 
    },
    { 
      title: "Paket Terdistribusi", 
      count: stageData[4].completed,
      icon: Truck,
      color: "bg-red-500" 
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-gray-500">Pantau progres real-time semua tahapan qurban.</p>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-6">
                <div className={`${card.color} p-3 rounded-lg mr-4`}>
                  <card.icon className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold">{card.count}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different monitoring views */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="progress">Progress Tahapan</TabsTrigger>
            <TabsTrigger value="animals">Data Hewan</TabsTrigger>
            <TabsTrigger value="distribution">Distribusi</TabsTrigger>
          </TabsList>
          
          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tahapan Qurban</CardTitle>
                <CardDescription>
                  Status penyelesaian setiap tahapan proses qurban
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stageData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, name === "completed" ? "Selesai" : "Total"]} />
                      <Legend formatter={(value) => value === "completed" ? "Selesai" : "Total"} />
                      <Bar dataKey="completed" fill="#8884d8" name="completed" />
                      <Bar dataKey="total" fill="#82ca9d" name="total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                  {stageData.map((stage, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium">{stage.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xl font-bold">{stage.completed}/{stage.total}</p>
                          <Badge variant={calculatePercentage(stage.completed, stage.total) >= 80 ? "secondary" : "default"}>
                            {calculatePercentage(stage.completed, stage.total)}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Animals Tab */}
          <TabsContent value="animals">
            <Card>
              <CardHeader>
                <CardTitle>Data Hewan Qurban</CardTitle>
                <CardDescription>
                  Distribusi jenis hewan qurban
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qurbanTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {qurbanTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} ekor`, 'Jumlah']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 mt-6 md:mt-0">
                  <h3 className="text-lg font-medium mb-4">Status Hewan</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p>Total Hewan Qurban:</p>
                      <p className="font-bold">{qurbanTypes.reduce((acc, curr) => acc + curr.value, 0)} ekor</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Diterima:</p>
                      <p className="font-bold">100 ekor</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Disembelih:</p>
                      <p className="font-bold">85 ekor</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Diproses:</p>
                      <p className="font-bold">70 ekor</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Distribution Tab */}
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribusi</CardTitle>
                <CardDescription>
                  Progress distribusi daging qurban berdasarkan area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="area" type="category" />
                      <Tooltip formatter={(value, name) => [value + " paket", name === "delivered" ? "Terkirim" : "Tertunda"]} />
                      <Legend formatter={(value) => value === "delivered" ? "Terkirim" : "Tertunda"} />
                      <Bar dataKey="delivered" fill="#82ca9d" name="delivered" />
                      <Bar dataKey="pending" fill="#ffc658" name="pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-500">Total Paket</p>
                    <p className="text-2xl font-bold">
                      {distributionData.reduce((acc, curr) => acc + curr.delivered + curr.pending, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Terkirim</p>
                    <p className="text-2xl font-bold text-green-600">
                      {distributionData.reduce((acc, curr) => acc + curr.delivered, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Belum Terkirim</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {distributionData.reduce((acc, curr) => acc + curr.pending, 0)}
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
