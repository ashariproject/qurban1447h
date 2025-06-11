
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfileSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: 'Ahmad Susanto',
    email: 'ahmad.susanto@example.com',
    telepon: '+62 812-3456-7890',
    jabatan: 'Admin',
    alamat: 'Jl. Pantai Mentari No. 123, Jakarta',
    bio: 'Koordinator utama sistem manajemen qurban'
  });

  const handleSave = () => {
    toast({
      title: "Profil Berhasil Diperbarui",
      description: "Data profil Anda telah disimpan.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>
            Kelola informasi pribadi dan kontak Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Ubah Foto
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG maksimal 2MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input 
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telepon">Nomor Telepon</Label>
              <Input 
                id="telepon"
                value={formData.telepon}
                onChange={(e) => setFormData({...formData, telepon: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Select value={formData.jabatan} onValueChange={(value) => setFormData({...formData, jabatan: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="petugas-shohibul">Petugas Shohibul</SelectItem>
                  <SelectItem value="petugas-hewan">Petugas Hewan</SelectItem>
                  <SelectItem value="petugas-pengemasan">Petugas Pengemasan</SelectItem>
                  <SelectItem value="petugas-distribusi">Petugas Distribusi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea 
              id="alamat"
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={3}
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>

          <Button onClick={handleSave} className="w-full md:w-auto">
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSettings;
