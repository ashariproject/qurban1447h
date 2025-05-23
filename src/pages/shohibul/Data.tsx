
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the form schema using zod
const formSchema = z.object({
  nama: z.string().min(3, {
    message: "Nama pengqurban harus diisi minimal 3 karakter.",
  }),
  atasNama: z.string().min(2, {
    message: "Atas nama qurban harus diisi minimal 2 karakter.",
  }),
  alamat: z.string().min(5, {
    message: "Alamat harus diisi minimal 5 karakter.",
  }),
  noHp: z.string().min(10, {
    message: "Nomor HP harus diisi minimal 10 digit.",
  }),
  jenisQurban: z.enum(["sapi-patungan", "sapi-utuh", "kambing"], {
    required_error: "Jenis qurban harus dipilih.",
  }),
  request: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ShohibulData = () => {
  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      atasNama: "",
      alamat: "",
      noHp: "",
      jenisQurban: undefined,
      request: "",
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    // Here you would usually save this data to your database
    // For now, we'll just show an alert
    alert("Data berhasil disimpan!");
    form.reset();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Data Shohibul</h1>
          <p className="text-gray-500">Kelola data shohibul qurban seperti nama, kontak, dan alamat.</p>
        </div>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Form Input Data Shohibul Qurban</CardTitle>
            <CardDescription>
              Masukkan detail informasi shohibul qurban di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pengqurban</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama pengqurban" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nama lengkap orang yang berqurban.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="atasNama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atas Nama Qurban</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan atas nama qurban" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nama yang diniatkan untuk qurban (bisa berbeda dengan nama pengqurban).
                      </FormDescription>
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
                        <Textarea placeholder="Masukkan alamat lengkap" {...field} />
                      </FormControl>
                      <FormDescription>
                        Alamat tempat tinggal pengqurban.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noHp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor HP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nomor HP" 
                          {...field} 
                          type="tel"
                        />
                      </FormControl>
                      <FormDescription>
                        Nomor HP aktif yang bisa dihubungi.
                      </FormDescription>
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
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="sapi-patungan" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Sapi Patungan
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="sapi-utuh" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Sapi Utuh
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="kambing" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Kambing
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="request"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan request khusus (opsional)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Request khusus terkait penyembelihan atau pendistribusian qurban (opsional).
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

        <div className="border rounded-lg p-4 bg-white">
          <p>Data shohibul yang sudah tersimpan akan ditampilkan di sini.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ShohibulData;
