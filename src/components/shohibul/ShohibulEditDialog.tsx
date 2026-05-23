import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShohibulData } from '@/pages/shohibul/Data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  noTelepon: z.string().min(1, "Nomor telepon harus diisi"),
  jenisQurban: z.enum(['sapi-mandiri', 'kambing-mandiri', 'kambing-titip-beli', 'sapi-patungan'], {
    required_error: "Jenis qurban harus dipilih",
  }),
  jumlahHewan: z.number().min(1, "Jumlah hewan minimal 1"),
  pembayaran: z.object({
    status: z.enum(['belum-bayar', 'lunas-cash', 'lunas-transfer', 'cicil'], {
      required_error: "Status pembayaran harus dipilih",
    }),
    jumlahDibayar: z.number().min(0, "Jumlah dibayar minimal 0"),
    totalBiaya: z.number().min(1, "Total biaya minimal 1"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ShohibulEditDialogProps {
  item: ShohibulData;
  onSave: (updatedData: Partial<ShohibulData>) => void;
  onCancel: () => void;
}

const ShohibulEditDialog: React.FC<ShohibulEditDialogProps> = ({
  item,
  onSave,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: item.nama,
      alamat: item.alamat,
      noTelepon: item.noTelepon,
      jenisQurban: item.jenisQurban,
      jumlahHewan: item.jumlahHewan,
      pembayaran: item.pembayaran,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Ensure pembayaran object has all required properties
    const updatedData: Partial<ShohibulData> = {
      ...data,
      pembayaran: {
        status: data.pembayaran.status,
        jumlahDibayar: data.pembayaran.jumlahDibayar,
        totalBiaya: data.pembayaran.totalBiaya,
      }
    };
    onSave(updatedData);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Data Shohibul</DialogTitle>
          <DialogDescription>
            Ubah data shohibul qurban. Klik simpan untuk menyimpan perubahan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noTelepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jenisQurban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Qurban</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis qurban" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sapi-mandiri">Sapi Mandiri</SelectItem>
                        <SelectItem value="kambing-mandiri">Kambing Mandiri</SelectItem>
                        <SelectItem value="kambing-titip-beli">Kambing (Titip Beli)</SelectItem>
                        <SelectItem value="sapi-patungan">Sapi Patungan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jumlahHewan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Hewan</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Masukkan jumlah hewan" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Data Pembayaran</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="pembayaran.status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pembayaran</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="belum-bayar">Belum Bayar</SelectItem>
                          <SelectItem value="lunas-cash">Lunas - Cash</SelectItem>
                          <SelectItem value="lunas-transfer">Lunas - Transfer</SelectItem>
                          <SelectItem value="cicil">Cicil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pembayaran.jumlahDibayar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Dibayar</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pembayaran.totalBiaya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Biaya</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min="1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShohibulEditDialog;
