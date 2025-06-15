
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Video, Upload, Eye, Search, Filter, Calendar, User, Beef } from "lucide-react";

interface AnimalDocumentation {
  id: string;
  animalCode: string;
  animalType: 'sapi' | 'kambing';
  shohibulName: string;
  shohibulId: string;
  documentationType: 'penyembelihan' | 'pemotongan' | 'pengemasan';
  mediaType: 'foto' | 'video';
  fileName: string;
  fileUrl: string;
  description: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'tersimpan' | 'diverifikasi' | 'dipublikasi';
}

const Documentation = () => {
  const [documentations, setDocumentations] = useState<AnimalDocumentation[]>([
    {
      id: '1',
      animalCode: 'SP001',
      animalType: 'sapi',
      shohibulName: 'Ahmad Susanto',
      shohibulId: 'SH001',
      documentationType: 'penyembelihan',
      mediaType: 'foto',
      fileName: 'penyembelihan_SP001_01.jpg',
      fileUrl: '/placeholder.svg',
      description: 'Dokumentasi proses penyembelihan hewan sapi SP001 milik Ahmad Susanto',
      uploadDate: '2024-01-15',
      uploadedBy: 'Petugas Hewan',
      status: 'diverifikasi'
    },
    {
      id: '2',
      animalCode: 'KM001',
      animalType: 'kambing',
      shohibulName: 'Siti Nurhaliza',
      shohibulId: 'SH002',
      documentationType: 'pemotongan',
      mediaType: 'video',
      fileName: 'pemotongan_KM001.mp4',
      fileUrl: '/placeholder.svg',
      description: 'Video dokumentasi proses pemotongan kambing KM001',
      uploadDate: '2024-01-16',
      uploadedBy: 'Petugas Hewan',
      status: 'tersimpan'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('semua');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    animalCode: '',
    documentationType: '',
    mediaType: '',
    description: '',
    file: null as File | null
  });

  const filteredDocumentations = documentations.filter(doc => {
    const matchesSearch = doc.animalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.shohibulName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'semua' || doc.animalType === filterType;
    const matchesStatus = filterStatus === 'semua' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUploadSubmit = () => {
    if (uploadForm.animalCode && uploadForm.documentationType && uploadForm.mediaType && uploadForm.file) {
      const newDoc: AnimalDocumentation = {
        id: Date.now().toString(),
        animalCode: uploadForm.animalCode,
        animalType: uploadForm.animalCode.startsWith('SP') ? 'sapi' : 'kambing',
        shohibulName: 'Data Shohibul', // Would be fetched based on animal code
        shohibulId: 'SH-AUTO',
        documentationType: uploadForm.documentationType as any,
        mediaType: uploadForm.mediaType as any,
        fileName: uploadForm.file.name,
        fileUrl: '/placeholder.svg',
        description: uploadForm.description,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Petugas Hewan',
        status: 'tersimpan'
      };
      
      setDocumentations(prev => [newDoc, ...prev]);
      setUploadForm({
        animalCode: '',
        documentationType: '',
        mediaType: '',
        description: '',
        file: null
      });
      setIsUploadModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tersimpan': return 'bg-yellow-100 text-yellow-800';
      case 'diverifikasi': return 'bg-green-100 text-green-800';
      case 'dipublikasi': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'sapi' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Dokumentasi Hewan</h1>
          <p className="text-purple-100">Kelola dokumentasi foto dan video penyembelihan hewan qurban untuk setiap shohibul</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Dokumentasi</p>
                  <p className="text-2xl font-bold">{documentations.length}</p>
                </div>
                <Camera className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Foto</p>
                  <p className="text-2xl font-bold">{documentations.filter(d => d.mediaType === 'foto').length}</p>
                </div>
                <Camera className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Video</p>
                  <p className="text-2xl font-bold">{documentations.filter(d => d.mediaType === 'video').length}</p>
                </div>
                <Video className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Diverifikasi</p>
                  <p className="text-2xl font-bold">{documentations.filter(d => d.status === 'diverifikasi').length}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload and Filters */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Dokumentasi Hewan</CardTitle>
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Dokumentasi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Dokumentasi Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="animalCode">Kode Hewan</Label>
                      <Input
                        id="animalCode"
                        placeholder="SP001 / KM001"
                        value={uploadForm.animalCode}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, animalCode: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="docType">Jenis Dokumentasi</Label>
                      <Select value={uploadForm.documentationType} onValueChange={(value) => setUploadForm(prev => ({ ...prev, documentationType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis dokumentasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="penyembelihan">Penyembelihan</SelectItem>
                          <SelectItem value="pemotongan">Pemotongan</SelectItem>
                          <SelectItem value="pengemasan">Pengemasan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="mediaType">Jenis Media</Label>
                      <Select value={uploadForm.mediaType} onValueChange={(value) => setUploadForm(prev => ({ ...prev, mediaType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis media" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="foto">Foto</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        placeholder="Deskripsi dokumentasi"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                    
                    <Button onClick={handleUploadSubmit} className="w-full">
                      Upload Dokumentasi
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan kode hewan atau nama shohibul..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="sapi">Sapi</SelectItem>
                  <SelectItem value="kambing">Kambing</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="tersimpan">Tersimpan</SelectItem>
                  <SelectItem value="diverifikasi">Diverifikasi</SelectItem>
                  <SelectItem value="dipublikasi">Dipublikasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documentation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocumentations.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Beef className="h-4 w-4" />
                          <span className="font-semibold">{doc.animalCode}</span>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      
                      {/* Media Preview */}
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        {doc.mediaType === 'foto' ? (
                          <Camera className="h-12 w-12 text-gray-400" />
                        ) : (
                          <Video className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{doc.shohibulName}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(doc.animalType)}>
                            {doc.animalType.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {doc.documentationType}
                          </Badge>
                          <Badge variant="outline">
                            {doc.mediaType}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {doc.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{doc.uploadDate}</span>
                          <span>•</span>
                          <span>{doc.uploadedBy}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Lihat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredDocumentations.length === 0 && (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada dokumentasi yang ditemukan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documentation;
