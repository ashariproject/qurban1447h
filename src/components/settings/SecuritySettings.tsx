
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, AlertTriangle, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { toast } = useToast();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: true
  });

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Password baru dan konfirmasi tidak cocok.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Berhasil Diubah",
      description: "Password Anda telah diperbarui dengan aman.",
    });
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const toggleSecurity = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Ubah Password
          </CardTitle>
          <CardDescription>
            Perbarui password Anda untuk menjaga keamanan akun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input 
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input 
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input 
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            />
          </div>

          <Button onClick={handlePasswordChange} className="w-full md:w-auto">
            Ubah Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autentikasi Dua Faktor
          </CardTitle>
          <CardDescription>
            Tambahkan lapisan keamanan ekstra untuk akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>2FA dengan SMS</Label>
              <p className="text-sm text-gray-500">
                Terima kode verifikasi melalui SMS
              </p>
            </div>
            <div className="flex items-center gap-2">
              {securitySettings.twoFactorAuth && (
                <Badge variant="secondary">Aktif</Badge>
              )}
              <Switch 
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={() => toggleSecurity('twoFactorAuth')}
              />
            </div>
          </div>

          {securitySettings.twoFactorAuth && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Smartphone className="h-4 w-4" />
                <span className="font-medium">2FA Diaktifkan</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Kode verifikasi akan dikirim ke +62 812-****-7890
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Keamanan</CardTitle>
          <CardDescription>
            Konfigurasi tambahan untuk melindungi akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Login</Label>
              <p className="text-sm text-gray-500">
                Terima notifikasi saat ada login dari perangkat baru
              </p>
            </div>
            <Switch 
              checked={securitySettings.loginAlerts}
              onCheckedChange={() => toggleSecurity('loginAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Logout</Label>
              <p className="text-sm text-gray-500">
                Logout otomatis setelah 30 menit tidak aktif
              </p>
            </div>
            <Switch 
              checked={securitySettings.sessionTimeout}
              onCheckedChange={() => toggleSecurity('sessionTimeout')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Aktivitas Login Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Login saat ini</p>
                <p className="text-sm text-gray-500">Chrome - Windows 10</p>
              </div>
              <Badge variant="secondary">Aktif</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">2 jam yang lalu</p>
                <p className="text-sm text-gray-500">Firefox - Android</p>
              </div>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
