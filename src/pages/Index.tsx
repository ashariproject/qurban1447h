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
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // User credentials with their roles and redirect paths
  const validCredentials = {
    admin: { 
      password: 'admin123', 
      role: 'admin',
      redirectPath: '/admin'
    },
    petugasshohibul: { 
      password: 'petugas123', 
      role: 'shohibul',
      redirectPath: '/shohibul/data'
    },
    petugashewan: { 
      password: 'petugas123', 
      role: 'animal',
      redirectPath: '/animal/data'
    },
    petugaspengemasan: { 
      password: 'petugas123', 
      role: 'packaging',
      redirectPath: '/packaging/data'
    },
    petugasdistribusi: { 
      password: 'petugas123', 
      role: 'distribution',
      redirectPath: '/distribution/recipients'
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userCredential = validCredentials[username as keyof typeof validCredentials];
    
    if (userCredential && userCredential.password === password) {
      setIsLoggedIn(true);
      setUserRole(userCredential.role);
      
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${username}!`,
      });

      // Redirect to appropriate page based on role
      if (username === 'admin') {
        // Admin stays on dashboard
        return;
      } else {
        // Other users redirect to their specific pages
        navigate(userCredential.redirectPath);
      }
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
    setUserRole('');
    navigate('/');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem.",
    });
  };

  // Only show dashboard for admin users
  if (isLoggedIn && username === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard Qurban As Sakinah - Admin</h1>
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
              <div><strong>admin</strong> / admin123 (Dashboard utama)</div>
              <div><strong>petugasshohibul</strong> / petugas123 (Data Shohibul)</div>
              <div><strong>petugashewan</strong> / petugas123 (Data Hewan)</div>
              <div><strong>petugaspengemasan</strong> / petugas123 (Data Pengemasan)</div>
              <div><strong>petugasdistribusi</strong> / petugas123 (Data Penerima)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
