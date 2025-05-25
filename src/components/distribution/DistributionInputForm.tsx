
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  lokasi: z.string().min(1, "Lokasi harus dipilih"),
  jumlahPaket: z.number().min(1, "Jumlah paket harus lebih dari 0"),
  jenisKemasan: z.enum(["kg1", "kg2", "kg5"], {
    required_error: "Jenis kemasan harus dipilih",
  }),
  namaPenerima: z.string().min(1, "Nama penerima harus diisi"),
  noHpPenerima: z.string().min(10, "Nomor HP penerima harus valid"),
  catatan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DistributionInputForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lokasi: "",
      jumlahPaket: 0,
      namaPenerima: "",
      noHpPenerima: "",
      catatan: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Data Distribusi:", data);
    alert("Data distribusi berhasil disimpan!");
    form.reset();
  };

  const lokasiOptions = [
    "Pantai Mentari",
    "Sukolilo",
    "Gunung Anyar", 
    "Rungkut",
    "Tenggilis",
    "Gebang",
    "Lainnya"
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Form Input Distribusi</CardTitle>
        <CardDescription>
          Input jumlah paket yang diserahkan sesuai dengan lokasi distribusi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="lokasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Distribusi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lokasi distribusi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lokasiOptions.map((lokasi) => (
                        <SelectItem key={lokasi} value={lokasi}>
                          {lokasi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih lokasi dimana paket akan diserahkan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlahPaket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Paket</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Masukkan jumlah paket"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Jumlah paket yang diserahkan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenisKemasan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kemasan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kemasan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg1">1 Kg</SelectItem>
                      <SelectItem value="kg2">2 Kg</SelectItem>
                      <SelectItem value="kg5">5 Kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Ukuran kemasan yang diserahkan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="namaPenerima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penerima</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama penerima" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nama koordinator penerima di lokasi distribusi.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noHpPenerima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No HP Penerima</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Masukkan nomor HP penerima" 
                      {...field}
                      type="tel" 
                    />
                  </FormControl>
                  <FormDescription>
                    Nomor HP penerima yang bisa dihubungi.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catatan tambahan (opsional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Catatan tambahan terkait penyerahan paket.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Simpan Data Distribusi</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DistributionInputForm;
