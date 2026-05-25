
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, CREDENTIALS } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Lock, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang kembali di QurbanKu.",
        });
        
        // Redirect based on role
        const foundUser = CREDENTIALS[username.toLowerCase()];
        if (foundUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(`/${foundUser.role}`);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Username atau password salah. Silakan coba lagi.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Gagal menghubungkan ke sistem autentikasi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-qurban-50 via-white to-blue-50 p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-qurban-500 to-blue-500" />
      
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-qurban-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-qurban-400/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/30">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">QurbanKu</CardTitle>
            <CardDescription className="text-qurban-100 mt-2 font-medium">
              Sistem Informasi Manajemen Qurban Terintegrasi<br/>
              <span className="text-white/90 font-bold mt-1 inline-block">Masjid As Sakinah Pantai Mentari Surabaya</span>
            </CardDescription>
          </div>
        </div>
        
        <CardHeader className="pt-8">
          <CardTitle className="text-xl text-center text-gray-800">Silakan Masuk</CardTitle>
          <CardDescription className="text-center">
            Gunakan kredensial petugas Anda untuk mengakses sistem
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="username"
                  placeholder="admin / shohibul / hewan ..." 
                  className="pl-10 h-12 border-gray-200 focus:border-qurban-500 focus:ring-qurban-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••" 
                  className="pl-10 h-12 border-gray-200 focus:border-qurban-500 focus:ring-qurban-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-qurban-600 hover:bg-qurban-700 text-lg font-semibold transition-all shadow-lg hover:shadow-qurban-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Masuk ke Sistem
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 bg-gray-50 border-t border-gray-100 p-6">
          <Button asChild variant="outline" className="w-full h-10 border-gray-200 text-gray-600 hover:bg-gray-100">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Website Utama
            </Link>
          </Button>
          <p className="text-xs text-center text-gray-500">
            Masjid As Sakinah Pantai Mentari © 2026
          </p>
        </CardFooter>
      </Card>
      
    </div>
  );
};

export default Login;
