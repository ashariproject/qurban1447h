
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { useQurban } from '@/contexts/QurbanContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Save, RotateCcw, Download, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';

const AdminDatabase = () => {
  const { shohibulList, hewanList, animalData, packagingData, distributionList, fetchData } = useQurban();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    toast({
      variant: "destructive",
      title: "Fitur Dinonaktifkan",
      description: "Aplikasi kini terhubung ke Supabase. Hubungi administrator database untuk reset masal.",
    });
  };

  const downloadJSON = () => {
    const data = {
      shohibulList,
      hewanList,
      animalData,
      packagingData,
      distributionList,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qurban_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        toast({
          title: "Mengimpor data...",
          description: "Sedang mengunggah data ke Supabase. Harap tunggu.",
        });

        // 1. Sync Shohibul
        if (json.shohibulList && Array.isArray(json.shohibulList) && json.shohibulList.length > 0) {
          const { error: err } = await supabase.from('shohibul').upsert(json.shohibulList);
          if (err) throw new Error("Gagal mengimpor shohibul: " + err.message);
        }

        // 2. Sync Hewan
        if (json.hewanList && Array.isArray(json.hewanList) && json.hewanList.length > 0) {
          const { error: err } = await supabase.from('hewan').upsert(json.hewanList);
          if (err) throw new Error("Gagal mengimpor hewan: " + err.message);
        }

        // 3. Sync Packaging
        if (json.packagingData) {
          const { error: err } = await supabase.from('packaging').upsert({ id: 'main', ...json.packagingData });
          if (err) throw new Error("Gagal mengimpor packaging: " + err.message);
        }

        // 4. Sync Distribution
        if (json.distributionList && Array.isArray(json.distributionList) && json.distributionList.length > 0) {
          const { error: err } = await supabase.from('distribution').upsert(json.distributionList);
          if (err) throw new Error("Gagal mengimpor distribusi: " + err.message);
        }

        toast({
          title: "Import Berhasil!",
          description: "Database Supabase telah diperbarui dari file JSON backup.",
        });
        
        // Refresh context data
        await fetchData();
      } catch (error: any) {
        console.error("Import error:", error);
        toast({
          variant: "destructive",
          title: "Import Gagal",
          description: error.message || "Format file JSON tidak valid.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <Database className="h-10 w-10 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight uppercase">Database Center</h1>
                <p className="text-slate-400 font-medium">Sinkronisasi, Backup, dan Pemulihan Data Sistem QurbanKu</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
            <Database size={300} />
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold">Informasi Sinkronisasi</AlertTitle>
          <AlertDescription className="text-blue-700 text-xs">
            Aplikasi kini telah tersinkronisasi dengan Supabase Cloud Database. 
            Fitur import/export lokal dinonaktifkan untuk menjaga integritas data terpusat.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden group">
            <CardHeader className="bg-blue-600 text-white pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="h-5 w-5" />
                Backup Data
              </CardTitle>
              <CardDescription className="text-blue-100 text-xs italic">Simpan data saat ini ke komputer Anda.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={downloadJSON}
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 shadow-md"
              >
                Unduh File JSON
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white overflow-hidden group">
            <CardHeader className="bg-emerald-600 text-white pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5" />
                Restore Data
              </CardTitle>
              <CardDescription className="text-emerald-100 text-xs italic">Unggah file backup untuk menimpa data.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleImportJSON} 
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12 shadow-md"
              >
                Pilih File JSON
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white overflow-hidden group">
            <CardHeader className="bg-amber-600 text-white pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Save className="h-5 w-5" />
                Sinkron CSV
              </CardTitle>
              <CardDescription className="text-amber-100 text-xs italic">Sync data dengan master CSV 15 Mei.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={handleReset}
                className="w-full bg-amber-600 hover:bg-amber-700 font-bold h-12 shadow-md"
              >
                Sync Sekarang
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white overflow-hidden group">
            <CardHeader className="bg-red-600 text-white pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <RotateCcw className="h-5 w-5" />
                Reset Total
              </CardTitle>
              <CardDescription className="text-red-100 text-xs italic">Hapus semua data (Kosongkan).</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={handleReset} 
                variant="destructive"
                className="w-full font-bold h-12 shadow-md"
              >
                Kosongkan Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-wider">Live Database Preview</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400">STATUS SINKRONISASI AKTIF</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
              {shohibulList.length} Shohibul | {hewanList.length} Hewan
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative group">
              <pre className="p-8 bg-slate-900 text-emerald-400 overflow-auto max-h-[400px] text-[10px] font-mono leading-relaxed scrollbar-hide">
                {JSON.stringify({ shohibul: shohibulList, hewan: hewanList }, null, 2)}
              </pre>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" className="text-[10px] h-7" onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({ shohibul: shohibulList, hewan: hewanList }, null, 2));
                  toast({ title: "Copied", description: "JSON copied to clipboard" });
                }}>Copy JSON</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDatabase;
