import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Database, HardDrive, AlertCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQurban } from '@/contexts/QurbanContext';

const SystemSettings = () => {
  const { toast } = useToast();
  const { resetAllData } = useQurban();
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    dataRetention: '12',
    timezone: 'Asia/Jakarta',
    language: 'id',
    debugMode: false
  });

  const handleBackup = () => {
    toast({
      title: "Backup Dimulai",
      description: "Proses backup data sedang berlangsung...",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Data",
      description: "Data berhasil diekspor ke file CSV.",
    });
  };

  const handleReset = () => {
    resetAllData();
    toast({
      title: "Data Berhasil Direset",
      description: "Semua data qurban telah dikembalikan ke nilai awal.",
    });
  };

  const toggleSetting = (key: keyof typeof systemSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Master Reset Data */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Master Reset Data
          </CardTitle>
          <CardDescription className="text-red-600">
            Reset semua data qurban ke nilai awal. Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleReset}
            variant="destructive"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Semua Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup & Restore
          </CardTitle>
          <CardDescription>
            Kelola backup data dan pengaturan sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Otomatis</Label>
              <p className="text-sm text-gray-500">
                Backup data setiap hari pada pukul 02:00
              </p>
            </div>
            <Switch 
              checked={systemSettings.autoBackup}
              onCheckedChange={() => toggleSetting('autoBackup')}
            />
          </div>

          <div className="space-y-2">
            <Label>Retensi Data (bulan)</Label>
            <Select 
              value={systemSettings.dataRetention} 
              onValueChange={(value) => setSystemSettings({...systemSettings, dataRetention: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Bulan</SelectItem>
                <SelectItem value="12">12 Bulan</SelectItem>
                <SelectItem value="24">24 Bulan</SelectItem>
                <SelectItem value="unlimited">Tidak Terbatas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleBackup} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Backup Sekarang
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Export Data
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Backup terakhir: 10 Jun 2024</span>
              <Badge variant="secondary">Berhasil</Badge>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-gray-500">Storage: 850MB / 1GB</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferensi Regional</CardTitle>
          <CardDescription>
            Atur zona waktu dan bahasa sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Zona Waktu</Label>
            <Select 
              value={systemSettings.timezone} 
              onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Jakarta">WIB (Jakarta)</SelectItem>
                <SelectItem value="Asia/Makassar">WITA (Makassar)</SelectItem>
                <SelectItem value="Asia/Jayapura">WIT (Jayapura)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bahasa</Label>
            <Select 
              value={systemSettings.language} 
              onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Informasi Sistem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Versi Aplikasi</Label>
              <p className="text-sm text-gray-600">v2.1.4</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Database</Label>
              <p className="text-sm text-gray-600">PostgreSQL 14.2</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Server</Label>
              <p className="text-sm text-gray-600">Ubuntu 22.04 LTS</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Uptime</Label>
              <p className="text-sm text-gray-600">15 hari 8 jam</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode Debug</Label>
              <p className="text-sm text-gray-500">
                Aktifkan log detail untuk troubleshooting
              </p>
            </div>
            <Switch 
              checked={systemSettings.debugMode}
              onCheckedChange={() => toggleSetting('debugMode')}
            />
          </div>

          {systemSettings.debugMode && (
            <div className="p-3 bg-yellow-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                Mode debug aktif. Matikan setelah selesai troubleshooting untuk performa optimal.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button className="w-full md:w-auto">
        Simpan Semua Pengaturan
      </Button>
    </div>
  );
};

export default SystemSettings;
