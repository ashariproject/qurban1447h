
import { useState, useCallback } from 'react';
import { GoogleSheetsService } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

export const useGoogleSheets = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getSheetService = useCallback(() => {
    const apiKey = localStorage.getItem('googleSheetsApiKey');
    const spreadsheetId = localStorage.getItem('googleSheetsSpreadsheetId');

    if (!apiKey || !spreadsheetId) {
      throw new Error('Google Sheets not configured');
    }

    return new GoogleSheetsService({ apiKey, spreadsheetId });
  }, []);

  const syncShohibulData = useCallback(async (shohibulData: any[]) => {
    setIsLoading(true);
    try {
      const service = getSheetService();
      
      // Prepare header row
      const headers = [
        'ID', 'Nama', 'Alamat', 'No Telepon', 'Jenis Qurban', 
        'Jumlah Hewan', 'Status Pembayaran', 'Jumlah Dibayar', 
        'Total Biaya', 'Tanggal Daftar'
      ];

      // Prepare data rows
      const rows = shohibulData.map(item => [
        item.id,
        item.nama,
        item.alamat,
        item.noTelepon,
        item.jenisQurban,
        item.jumlahHewan,
        item.pembayaran.status,
        item.pembayaran.jumlahDibayar,
        item.pembayaran.totalBiaya,
        item.tanggalDaftar
      ]);

      // Write to sheet
      await service.writeSheet('Shohibul!A1:J1000', [headers, ...rows]);

      toast({
        title: "Sinkronisasi Berhasil",
        description: "Data shohibul berhasil disinkronkan ke Google Sheets",
      });
    } catch (error) {
      console.error('Error syncing shohibul data:', error);
      toast({
        title: "Sinkronisasi Gagal",
        description: "Gagal sinkronisasi data ke Google Sheets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getSheetService, toast]);

  const syncDistributionData = useCallback(async (distributionData: any[]) => {
    setIsLoading(true);
    try {
      const service = getSheetService();
      
      const headers = [
        'ID', 'Tanggal', 'Jenis Distribusi', 'Penerima', 'No HP',
        'Wilayah', 'Sektor', 'Jumlah Paket', 'Jenis Kemasan',
        'Status', 'Waktu Kirim', 'Catatan'
      ];

      const rows = distributionData.map(item => [
        item.id,
        item.tanggal,
        item.jenisDistribusi,
        item.penerima,
        item.noHp,
        item.wilayah,
        item.sektor,
        item.jumlahPaket,
        item.jenisKemasan,
        item.status,
        item.waktuKirim || '',
        item.catatan || ''
      ]);

      await service.writeSheet('Distribusi!A1:L1000', [headers, ...rows]);

      toast({
        title: "Sinkronisasi Berhasil",
        description: "Data distribusi berhasil disinkronkan ke Google Sheets",
      });
    } catch (error) {
      console.error('Error syncing distribution data:', error);
      toast({
        title: "Sinkronisasi Gagal",
        description: "Gagal sinkronisasi data distribusi ke Google Sheets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getSheetService, toast]);

  return {
    isLoading,
    syncShohibulData,
    syncDistributionData,
    getSheetService
  };
};
