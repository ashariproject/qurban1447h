
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  hewanId: z.string().min(1, "ID hewan harus dipilih"),
  jenisHewan: z.enum(["sapi", "kambing"], {
    required_error: "Jenis hewan harus dipilih",
  }),
  statusPenyembelihan: z.boolean(),
  statusPengeletan: z.boolean(),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AnimalProcessForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hewanId: "",
      statusPenyembelihan: false,
      statusPengeletan: false,
      keterangan: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Data Proses Hewan:", data);
    alert("Status hewan berhasil diperbarui!");
    form.reset();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Form Proses Hewan</CardTitle>
        <CardDescription>
          Konfirmasi status penyembelihan dan pengeletan hewan qurban.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="hewanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Hewan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan ID hewan" {...field} />
                  </FormControl>
                  <FormDescription>
                    ID unik hewan yang akan diproses.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenisHewan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Hewan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis hewan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sapi">Sapi</SelectItem>
                      <SelectItem value="kambing">Kambing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statusPenyembelihan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Hewan sudah disembelih
                    </FormLabel>
                    <FormDescription>
                      Centang jika hewan sudah melalui proses penyembelihan.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statusPengeletan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Hewan sudah dikeleton
                    </FormLabel>
                    <FormDescription>
                      Centang jika hewan sudah melalui proses pengeletan.
                    </FormDescription>
                  </div>
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
                    Catatan tambahan terkait proses hewan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Simpan Status</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnimalProcessForm;
