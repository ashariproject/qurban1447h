
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
  jenisDistribusi: z.enum(["shohibul", "warga"], {
    required_error: "Jenis distribusi harus dipilih",
  }),
  shohibulId: z.string().optional(),
  wilayahWarga: z.string().optional(),
  sektorDetail: z.string().optional(),
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
      jenisDistribusi: undefined,
      shohibulId: "",
      wilayahWarga: "",
      sektorDetail: "",
      jumlahPaket: 0,
      namaPenerima: "",
      noHpPenerima: "",
      catatan: "",
    },
  });

  const watchJenisDistribusi = form.watch('jenisDistribusi');
  const watchWilayahWarga = form.watch('wilayahWarga');

  const onSubmit = (data: FormValues) => {
    console.log("Data Distribusi:", data);
    alert("Data distribusi berhasil disimpan!");
    form.reset();
  };

  // Data shohibul yang tersimpan (contoh data)
  const shohibulOptions = [
    { id: "SH001", nama: "Ahmad Suryanto" },
    { id: "SH002", nama: "Siti Nurhaliza" },
    { id: "SH003", nama: "Budi Santoso" },
    { id: "SH004", nama: "Fatimah Rahman" },
    { id: "SH005", nama: "Muhammad Ridwan" },
  ];

  const wilayahWargaOptions = [
    { value: "pantai_mentari", label: "Pantai Mentari (6 sektor)" },
    { value: "komplek_al", label: "Komplek AL (4 gang)" },
  ];

  const getSektorOptions = () => {
    if (watchWilayahWarga === "pantai_mentari") {
      return [
        "Sektor 1 - Pantai Mentari Timur",
        "Sektor 2 - Pantai Mentari Barat",
        "Sektor 3 - Pantai Mentari Utara",
        "Sektor 4 - Pantai Mentari Selatan",
        "Sektor 5 - Pantai Mentari Tengah",
        "Sektor 6 - Pantai Mentari Pesisir"
      ];
    } else if (watchWilayahWarga === "komplek_al") {
      return [
        "Gang 1 - Jl. Laksamana",
        "Gang 2 - Jl. Admiral",
        "Gang 3 - Jl. Kapten Laut",
        "Gang 4 - Jl. Kolonel Laut"
      ];
    }
    return [];
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Form Input Distribusi</CardTitle>
        <CardDescription>
          Input distribusi untuk Shohibul Qurban atau Warga sesuai wilayah yang ditentukan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jenisDistribusi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Distribusi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis distribusi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="shohibul">Shohibul Qurban</SelectItem>
                      <SelectItem value="warga">Distribusi Warga</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih apakah distribusi untuk shohibul atau warga umum.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchJenisDistribusi === "shohibul" && (
              <FormField
                control={form.control}
                name="shohibulId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Shohibul Qurban</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih shohibul qurban" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shohibulOptions.map((shohibul) => (
                          <SelectItem key={shohibul.id} value={shohibul.id}>
                            {shohibul.id} - {shohibul.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pilih shohibul qurban yang akan menerima distribusi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchJenisDistribusi === "warga" && (
              <>
                <FormField
                  control={form.control}
                  name="wilayahWarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wilayah Distribusi Warga</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih wilayah distribusi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wilayahWargaOptions.map((wilayah) => (
                            <SelectItem key={wilayah.value} value={wilayah.value}>
                              {wilayah.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih wilayah untuk distribusi warga.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchWilayahWarga && (
                  <FormField
                    control={form.control}
                    name="sektorDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detail Sektor/Gang</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih sektor/gang detail" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getSektorOptions().map((sektor) => (
                              <SelectItem key={sektor} value={sektor}>
                                {sektor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Pilih sektor atau gang spesifik untuk distribusi.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

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
                    Nama penerima atau koordinator di lokasi distribusi.
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
