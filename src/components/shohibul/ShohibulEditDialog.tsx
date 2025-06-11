
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
  jenisQurban: z.enum(['sapi-mandiri', 'kambing-mandiri'], {
    required_error: "Jenis qurban harus dipilih",
  }),
  jumlahHewan: z.number().min(1, "Jumlah hewan minimal 1"),
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
    },
  });

  const onSubmit = (data: FormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
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
