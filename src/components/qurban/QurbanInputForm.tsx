
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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

interface QurbanInputFormProps {
  onSubmit: (data: Omit<FormValues, 'id' | 'tanggalDaftar'>) => void;
}

const QurbanInputForm: React.FC<QurbanInputFormProps> = ({ onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      noTelepon: "",
      jumlahHewan: 1,
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Input Data Shohibul</CardTitle>
        <CardDescription>
          Masukkan data shohibul qurban baru termasuk jenis qurban yang dipilih.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nama lengkap shohibul qurban.
                    </FormDescription>
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
                    <FormDescription>
                      Nomor telepon yang dapat dihubungi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat lengkap" {...field} />
                  </FormControl>
                  <FormDescription>
                    Alamat lengkap tempat tinggal shohibul.
                  </FormDescription>
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
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pilih jenis hewan qurban yang akan disembelih.
                    </FormDescription>
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
                        min="1"
                      />
                    </FormControl>
                    <FormDescription>
                      Jumlah hewan qurban yang akan disembelih.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Simpan Data Shohibul</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QurbanInputForm;
