
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
  const [apiKey, setApiKey] = useState(localStorage.getItem('googleSheetsApiKey') || '');
  const [spreadsheetId, setSpreadsheetId] = useState(localStorage.getItem('googleSheetsSpreadsheetId') || '');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveConfig = () => {
    if (!apiKey || !spreadsheetId) {
      toast({
        title: "Error",
        description: "Harap isi API Key dan Spreadsheet ID",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('googleSheetsApiKey', apiKey);
    localStorage.setItem('googleSheetsSpreadsheetId', spreadsheetId);
    
    toast({
      title: "Konfigurasi Disimpan",
      description: "Konfigurasi Google Sheets berhasil disimpan",
    });

    onConfigSaved?.({ apiKey, spreadsheetId });
  };

  const handleTestConnection = async () => {
    if (!apiKey || !spreadsheetId) {
      toast({
        title: "Error",
        description: "Harap isi API Key dan Spreadsheet ID terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);

    try {
      const sheetsService = new GoogleSheetsService({ apiKey, spreadsheetId });
      await sheetsService.readSheet('A1:A1');
      
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
        <div className="space-y-2">
          <Label htmlFor="apiKey">Google Sheets API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Masukkan API Key dari Google Cloud Console"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
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
          <h4 className="font-medium">Panduan Setup:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Buka Google Cloud Console dan buat project baru</li>
            <li>Enable Google Sheets API</li>
            <li>Buat API Key di Credentials</li>
            <li>Buat Google Sheet dan share dengan "Anyone with link can view"</li>
            <li>Copy Spreadsheet ID dari URL</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;
