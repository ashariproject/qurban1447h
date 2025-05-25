
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple credentials for easy access
  const validCredentials = {
    admin: 'admin123',
    petugas: 'petugas123',
    qurban: 'qurban123'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validCredentials[username as keyof typeof validCredentials] === password) {
      setIsLoggedIn(true);
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${username}!`,
      });
    } else {
      toast({
        title: "Login Gagal",
        description: "Username atau password salah!",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem.",
    });
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard Qurban As Sakinah</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <div className="p-6">
          <Dashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700">
            Sistem Qurban As Sakinah
          </CardTitle>
          <CardDescription>
            Masuk ke sistem manajemen qurban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Masuk
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Akun Demo:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>admin</strong> / admin123</div>
              <div><strong>petugas</strong> / petugas123</div>
              <div><strong>qurban</strong> / qurban123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
