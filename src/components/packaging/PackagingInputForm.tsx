
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

const formSchema = z.object({
  jenisOperasi: z.enum(["masuk", "keluar"], {
    required_error: "Jenis operasi harus dipilih",
  }),
  jumlah: z.number().min(1, "Jumlah harus lebih dari 0"),
  jenisKemasan: z.enum(["kg1", "kg2", "kg5"], {
    required_error: "Jenis kemasan harus dipilih",
  }),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PackagingInputForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jumlah: 0,
      keterangan: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Data Pengemasan:", data);
    alert("Data pengemasan berhasil disimpan!");
    form.reset();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Form Input Pengemasan</CardTitle>
        <CardDescription>
          Input jumlah daging yang masuk atau keluar dari proses pengemasan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jenisOperasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Operasi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis operasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="masuk">+ Masuk</SelectItem>
                      <SelectItem value="keluar">- Keluar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih apakah daging masuk ke proses pengemasan atau keluar setelah dikemas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Masukkan jumlah"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Jumlah paket yang masuk atau keluar.
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
                    Ukuran kemasan daging qurban.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Input placeholder="Keterangan tambahan (opsional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Catatan tambahan terkait proses pengemasan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Simpan Data</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PackagingInputForm;
