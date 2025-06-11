
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    shohibulUpdates: true,
    animalUpdates: true,
    packagingUpdates: false,
    distributionUpdates: true,
    systemAlerts: true,
    notificationFrequency: 'realtime'
  });

  const handleSave = () => {
    toast({
      title: "Pengaturan Notifikasi Disimpan",
      description: "Preferensi notifikasi Anda telah diperbarui.",
    });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metode Notifikasi</CardTitle>
          <CardDescription>
            Pilih cara Anda ingin menerima notifikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifikasi Email</Label>
              <p className="text-sm text-gray-500">
                Terima notifikasi melalui email
              </p>
            </div>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={() => toggleSetting('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifikasi SMS</Label>
              <p className="text-sm text-gray-500">
                Terima notifikasi melalui SMS
              </p>
            </div>
            <Switch 
              checked={settings.smsNotifications}
              onCheckedChange={() => toggleSetting('smsNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifikasi Push</Label>
              <p className="text-sm text-gray-500">
                Terima notifikasi push di browser
              </p>
            </div>
            <Switch 
              checked={settings.pushNotifications}
              onCheckedChange={() => toggleSetting('pushNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Notifikasi</CardTitle>
          <CardDescription>
            Pilih jenis update yang ingin Anda terima
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Update Shohibul</Label>
              <p className="text-sm text-gray-500">
                Pendaftaran baru, pembayaran, perubahan status
              </p>
            </div>
            <Switch 
              checked={settings.shohibulUpdates}
              onCheckedChange={() => toggleSetting('shohibulUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Update Hewan</Label>
              <p className="text-sm text-gray-500">
                Status hewan, penyembelihan, dokumentasi
              </p>
            </div>
            <Switch 
              checked={settings.animalUpdates}
              onCheckedChange={() => toggleSetting('animalUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Update Pengemasan</Label>
              <p className="text-sm text-gray-500">
                Proses pengemasan, siap distribusi
              </p>
            </div>
            <Switch 
              checked={settings.packagingUpdates}
              onCheckedChange={() => toggleSetting('packagingUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Update Distribusi</Label>
              <p className="text-sm text-gray-500">
                Pengiriman, konfirmasi penerima
              </p>
            </div>
            <Switch 
              checked={settings.distributionUpdates}
              onCheckedChange={() => toggleSetting('distributionUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Sistem</Label>
              <p className="text-sm text-gray-500">
                Error, pemeliharaan, update sistem
              </p>
            </div>
            <Switch 
              checked={settings.systemAlerts}
              onCheckedChange={() => toggleSetting('systemAlerts')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frekuensi Notifikasi</CardTitle>
          <CardDescription>
            Atur seberapa sering Anda ingin menerima notifikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Frekuensi</Label>
            <Select 
              value={settings.notificationFrequency} 
              onValueChange={(value) => setSettings({...settings, notificationFrequency: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Setiap Jam</SelectItem>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full md:w-auto">
        Simpan Pengaturan
      </Button>
    </div>
  );
};

export default NotificationSettings;
