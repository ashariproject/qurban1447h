
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GoogleSheetsService } from '@/services/googleSheetsService';
import { Settings, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

interface GoogleSheetsConfigProps {
  onConfigSaved?: (config: { apiKey: string; spreadsheetId: string }) => void;
}

const GoogleSheetsConfig: React.FC<GoogleSheetsConfigProps> = ({ onConfigSaved }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('lovable-cloud-connector');
  const [spreadsheetId, setSpreadsheetId] = useState(localStorage.getItem('googleSheetsSpreadsheetId') || '');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveConfig = () => {
    if (!spreadsheetId) {
      toast({
        title: "Error",
        description: "Harap isi Spreadsheet ID",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('googleSheetsApiKey', 'lovable-cloud-connector');
    localStorage.setItem('googleSheetsSpreadsheetId', spreadsheetId);
    
    toast({
      title: "Konfigurasi Disimpan",
      description: "Konfigurasi Google Sheets berhasil disimpan",
    });

    onConfigSaved?.({ apiKey, spreadsheetId });
  };

  const handleTestConnection = async () => {
    if (!spreadsheetId) {
      toast({
        title: "Error",
        description: "Harap isi Spreadsheet ID terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);

    try {
      const sheetsService = new GoogleSheetsService({ spreadsheetId });
      await sheetsService.verify();
      
      setIsConnected(true);
      toast({
        title: "Koneksi Berhasil",
        description: "Berhasil terhubung ke Google Sheets",
      });
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Koneksi Gagal",
        description: "Gagal terhubung ke Google Sheets. Periksa API Key dan Spreadsheet ID",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Konfigurasi Google Sheets
        </CardTitle>
        <CardDescription>
          Setup integrasi dengan Google Sheets untuk sinkronisasi data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          <strong>✓ Terhubung via Lovable Cloud Connector</strong> — autentikasi OAuth dikelola otomatis, tidak perlu API Key.
        </div>

        <div className="space-y-2">
          <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
          <Input
            id="spreadsheetId"
            placeholder="ID Google Sheet (dari URL)"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Copy dari URL Google Sheet: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveConfig}>
            Simpan Konfigurasi
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isTesting ? 'Testing...' : 'Test Koneksi'}
          </Button>
        </div>

        {isConnected && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Terhubung ke Google Sheets</span>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Cara Setup:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Pastikan Google Sheet sudah di-share dengan akun Google yang di-connect</li>
            <li>Copy Spreadsheet ID dari URL & simpan</li>
            <li>Klik <strong>Test Koneksi</strong> untuk verifikasi</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;
