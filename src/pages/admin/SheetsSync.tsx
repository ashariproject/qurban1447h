import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useQurban } from '@/contexts/QurbanContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, ExternalLink, FileSpreadsheet, RefreshCw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const AdminSheetsSync = () => {
  const { isLoading, syncShohibulData, syncDistributionData, fetchShohibulFromSheet, fetchDistributionFromSheet } = useGoogleSheets();
  const { shohibulList } = useQurban();
  const { toast } = useToast();
  const [remoteShohibul, setRemoteShohibul] = useState<any[]>([]);
  const [remoteDistribusi, setRemoteDistribusi] = useState<any[]>([]);
  const [lastFetch, setLastFetch] = useState<string>('');

  const spreadsheetId = localStorage.getItem('googleSheetsSpreadsheetId');
  const apiKey = localStorage.getItem('googleSheetsApiKey');
  const isConfigured = !!(spreadsheetId && apiKey);
  const sheetUrl = spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : '';

  const handleFetchAll = async () => {
    const [s, d] = await Promise.all([fetchShohibulFromSheet(), fetchDistributionFromSheet()]);
    setRemoteShohibul(s);
    setRemoteDistribusi(d);
    setLastFetch(new Date().toLocaleString('id-ID'));
  };

  const handlePushShohibul = () => syncShohibulData(shohibulList);

  if (!isConfigured) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Belum Terkonfigurasi</CardTitle>
            <CardDescription>Atur API Key dan Spreadsheet ID terlebih dahulu.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/integration/google-sheets"><Settings className="h-4 w-4 mr-2" />Buka Konfigurasi</Link>
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-7 w-7" /> Database Google Sheets
            </h1>
            <p className="text-green-100 text-sm">Cek &amp; sinkronisasi data antara aplikasi dan Google Sheets (Khusus Admin)</p>
          </div>
          <Button asChild variant="secondary">
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> Buka Google Sheet
            </a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Aksi Sinkronisasi</CardTitle>
            <CardDescription>
              Push = aplikasi ➜ Google Sheets. Fetch = Google Sheets ➜ aplikasi.
              {lastFetch && <span className="block mt-1 text-xs">Terakhir fetch: {lastFetch}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={handleFetchAll} disabled={isLoading} className="h-16">
              <Download className="h-5 w-5 mr-2" /> Fetch Semua dari Sheet
            </Button>
            <Button onClick={handlePushShohibul} disabled={isLoading} variant="outline" className="h-16">
              <Upload className="h-5 w-5 mr-2" /> Push Shohibul ke Sheet
            </Button>
            <Button onClick={() => syncDistributionData([])} disabled={isLoading} variant="outline" className="h-16">
              <Upload className="h-5 w-5 mr-2" /> Push Distribusi ke Sheet
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Data Shohibul (Google Sheet)</span>
              <Badge variant="secondary">{remoteShohibul.length} baris</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {remoteShohibul.length === 0 ? (
              <p className="text-sm text-muted-foreground">Klik "Fetch Semua dari Sheet" untuk memuat data.</p>
            ) : (
              <div className="overflow-x-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead><TableHead>Nama</TableHead>
                      <TableHead>Telepon</TableHead><TableHead>Jenis</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remoteShohibul.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.nama}</TableCell>
                        <TableCell>{r.noTelepon}</TableCell>
                        <TableCell>{r.jenisQurban}</TableCell>
                        <TableCell>{r.pembayaran.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Data Distribusi (Google Sheet)</span>
              <Badge variant="secondary">{remoteDistribusi.length} baris</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {remoteDistribusi.length === 0 ? (
              <p className="text-sm text-muted-foreground">Klik "Fetch Semua dari Sheet" untuk memuat data.</p>
            ) : (
              <div className="overflow-x-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead><TableHead>Tanggal</TableHead>
                      <TableHead>Penerima</TableHead><TableHead>Wilayah</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remoteDistribusi.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.tanggal}</TableCell>
                        <TableCell>{r.penerima}</TableCell>
                        <TableCell>{r.wilayah}</TableCell>
                        <TableCell>{r.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminSheetsSync;
