
import { useState, useCallback } from 'react';
import { GoogleSheetsService } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

export const useGoogleSheets = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getSheetService = useCallback(() => {
    const spreadsheetId = localStorage.getItem('googleSheetsSpreadsheetId');
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID belum dikonfigurasi');
    }
    return new GoogleSheetsService({ spreadsheetId });
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

  const fetchShohibulFromSheet = useCallback(async () => {
    setIsLoading(true);
    try {
      const service = getSheetService();
      const rows = await service.readSheet('Shohibul!A2:J1000');
      const data = (rows as any[][]).filter(r => r && r[0]).map((r) => ({
        id: String(r[0] ?? ''),
        nama: String(r[1] ?? ''),
        alamat: String(r[2] ?? ''),
        noTelepon: String(r[3] ?? ''),
        jenisQurban: String(r[4] ?? 'sapi-mandiri'),
        jumlahHewan: Number(r[5] ?? 1),
        pembayaran: {
          status: String(r[6] ?? 'belum-bayar'),
          jumlahDibayar: Number(r[7] ?? 0),
          totalBiaya: Number(r[8] ?? 0),
        },
        tanggalDaftar: String(r[9] ?? new Date().toISOString().split('T')[0]),
      }));
      toast({ title: 'Fetch Berhasil', description: `${data.length} data shohibul diambil dari Google Sheets` });
      return data;
    } catch (error) {
      console.error('Error fetching shohibul:', error);
      toast({ title: 'Fetch Gagal', description: 'Tidak bisa mengambil data dari Google Sheets', variant: 'destructive' });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getSheetService, toast]);

  const fetchDistributionFromSheet = useCallback(async () => {
    setIsLoading(true);
    try {
      const service = getSheetService();
      const rows = await service.readSheet('Distribusi!A2:L1000');
      const data = (rows as any[][]).filter(r => r && r[0]).map((r) => ({
        id: String(r[0] ?? ''),
        tanggal: String(r[1] ?? ''),
        jenisDistribusi: String(r[2] ?? ''),
        penerima: String(r[3] ?? ''),
        noHp: String(r[4] ?? ''),
        wilayah: String(r[5] ?? ''),
        sektor: String(r[6] ?? ''),
        jumlahPaket: Number(r[7] ?? 0),
        jenisKemasan: String(r[8] ?? ''),
        status: String(r[9] ?? ''),
        waktuKirim: String(r[10] ?? ''),
        catatan: String(r[11] ?? ''),
      }));
      toast({ title: 'Fetch Berhasil', description: `${data.length} data distribusi diambil dari Google Sheets` });
      return data;
    } catch (error) {
      console.error('Error fetching distribution:', error);
      toast({ title: 'Fetch Gagal', description: 'Tidak bisa mengambil data distribusi', variant: 'destructive' });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getSheetService, toast]);

  return {
    isLoading,
    syncShohibulData,
    syncDistributionData,
    fetchShohibulFromSheet,
    fetchDistributionFromSheet,
    getSheetService
  };
};
