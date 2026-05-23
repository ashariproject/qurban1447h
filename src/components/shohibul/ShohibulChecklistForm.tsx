
import React from 'react';
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar, Search, CheckCircle2 } from "lucide-react";
import { useQurban } from '@/contexts/QurbanContext';
import { useToast } from '@/hooks/use-toast';

const ShohibulChecklistForm = () => {
  const { shohibulList, updateShohibulStatus } = useQurban();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      shohibulId: "",
      statusPenyerahan: false,
      catatan: "",
      waktuPenyerahan: "",
    },
  });

  const selectedId = form.watch('shohibulId');
  const selectedShohibul = shohibulList.find(s => s.id === selectedId);

  const onSubmit = (data: any) => {
    if (!data.shohibulId) return;
    
    updateShohibulStatus(data.shohibulId, 'telahTerima', data.statusPenyerahan);
    // You could also save the 'catatan' if your ShohibulData had a field for it
    
    toast({
      title: "Status Diperbarui",
      description: `Status penyerahan untuk ${selectedShohibul?.nama} telah disimpan.`,
    });
    form.reset();
  };

  return (
    <Card className="w-full border-none shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardTitle className="flex items-center gap-2 uppercase tracking-wider text-sm font-black">
          <CheckCircle2 className="h-5 w-5" />
          Konfirmasi Penyerahan
        </CardTitle>
        <CardDescription className="text-blue-100">
          Cari shohibul dan validasi penerimaan daging qurban.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shohibulId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-500 uppercase">Cari Shohibul</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 border-gray-200">
                        <SelectValue placeholder="Pilih nama shohibul..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shohibulList.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nama} - {s.jenisQurban.split('-')[0].toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedShohibul && (
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-blue-900 leading-tight uppercase text-lg">{selectedShohibul.nama}</h4>
                    <p className="text-xs text-blue-600 font-bold">{selectedShohibul.alamat}</p>
                  </div>
                  <Badge className="bg-blue-600">
                    {selectedShohibul.jenisQurban.toUpperCase()}
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="statusPenyerahan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 bg-white p-3 rounded-lg border border-blue-200">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue('waktuPenyerahan', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-black text-gray-700 text-sm cursor-pointer">
                          Daging Telah Diterima Shohibul
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch('statusPenyerahan') && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                    <Clock className="h-3 w-3" />
                    Tercatat: {form.watch('waktuPenyerahan')}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="catatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black text-gray-400 uppercase">Catatan Petugas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Contoh: Diterima oleh keluarga, foto terlampir di dokumentasi..." 
                          className="text-xs min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-black h-12 uppercase tracking-widest shadow-lg shadow-blue-200">
                  Simpan Validasi
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${className}`}>
    {children}
  </span>
);

export default ShohibulChecklistForm;
