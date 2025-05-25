
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from 'date-fns';
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
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar } from "lucide-react";

const formSchema = z.object({
  shohibulId: z.string().min(1, "ID shohibul harus diisi"),
  namaShohibul: z.string().min(1, "Nama shohibul harus diisi"),
  statusPenyerahan: z.boolean(),
  fotoUrl: z.string().optional(),
  catatan: z.string().optional(),
  waktuPenyerahan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ShohibulChecklistForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shohibulId: "",
      namaShohibul: "",
      statusPenyerahan: false,
      fotoUrl: "",
      catatan: "",
      waktuPenyerahan: "",
    },
  });

  const handleStatusChange = (checked: boolean) => {
    if (checked) {
      const currentTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      form.setValue('waktuPenyerahan', currentTimestamp);
    } else {
      form.setValue('waktuPenyerahan', '');
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Data Checklist Shohibul:", data);
    alert("Checklist shohibul berhasil disimpan!");
    form.reset();
  };

  const watchStatusPenyerahan = form.watch('statusPenyerahan');
  const watchWaktuPenyerahan = form.watch('waktuPenyerahan');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Form Checklist Shohibul</CardTitle>
        <CardDescription>
          Konfirmasi penyerahan hak qurban kepada shohibul dan dokumentasi foto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shohibulId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Shohibul</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan ID shohibul" {...field} />
                  </FormControl>
                  <FormDescription>
                    ID unik shohibul qurban.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="namaShohibul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Shohibul</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama shohibul" {...field} />
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
              name="statusPenyerahan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleStatusChange(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Shohibul telah menerima haknya
                    </FormLabel>
                    <FormDescription>
                      Centang jika shohibul sudah menerima daging qurban sesuai haknya.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchStatusPenyerahan && watchWaktuPenyerahan && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Waktu Penyerahan:</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-green-700">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{format(new Date(watchWaktuPenyerahan), 'EEEE, dd MMMM yyyy - HH:mm:ss')}</span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="fotoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Foto Penyerahan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan URL foto dokumentasi" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link foto dokumentasi penyerahan daging qurban.
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
                    Catatan tambahan terkait penyerahan kepada shohibul.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Simpan Checklist</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ShohibulChecklistForm;
