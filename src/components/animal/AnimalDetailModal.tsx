import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, ShieldCheck, Heart, Info } from 'lucide-react';
import { HewanData, ShohibulData } from '@/contexts/QurbanContext';

interface AnimalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: HewanData | null;
  shohibulList: ShohibulData[];
  showWhatsApp?: boolean;
}

const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  isOpen,
  onClose,
  animal,
  shohibulList,
  showWhatsApp = false,
}) => {
  if (!animal) return null;

  // Resolve donor names and groups for each animal
  const getAnimalDonorDetails = () => {
    const representative = shohibulList.find(s => s.id === animal.shohibulId);
    if (!representative) {
      return {
        label: 'HAMBA ALLAH',
        isPatungan: false,
        shohibuls: []
      };
    }

    if (representative.jenisQurban === 'sapi-patungan') {
      const patunganShohibuls = shohibulList
        .filter(s => s.jenisQurban === 'sapi-patungan')
        .sort((a, b) => {
          const dateCompare = (a.tanggalDaftar || '').localeCompare(b.tanggalDaftar || '');
          if (dateCompare !== 0) return dateCompare;
          return a.nama.localeCompare(b.nama);
        });
      
      const match = animal.kode.match(/\d+/);
      const cowNumber = match ? parseInt(match[0], 10) : 1;
      const groupIdx = (cowNumber - 1) % 5;
      
      const start = groupIdx * 7;
      const group = patunganShohibuls.slice(start, start + 7);
      return {
        label: 'SAPI PATUNGAN/KOLEKTIF',
        isPatungan: true,
        shohibuls: group
      };
    }

    return {
      label: representative.nama,
      isPatungan: false,
      shohibuls: [representative]
    };
  };

  const { label, isPatungan, shohibuls } = getAnimalDonorDetails();

  const hasPhotos = animal.fotoUrls && animal.fotoUrls.length > 0;
  const livePhoto = hasPhotos 
    ? animal.fotoUrls[0] 
    : (animal.jenis === 'sapi' 
      ? "/images/sapi_bali_lokal.png" 
      : "/images/kambing_lokal.png"
    );

  const hasSlaughterPhoto = animal.fotoUrls && animal.fotoUrls.length > 1;
  const slaughterPhoto = hasSlaughterPhoto ? animal.fotoUrls[1] : null;

  const getWhatsAppLink = (shohibul: ShohibulData) => {
    const statusText = animal.status === 'dipotong' 
      ? 'Telah Selesai Dipotong & Sedang Dipaketkan' 
      : animal.status === 'disembelih' 
        ? 'Telah Disembelih' 
        : animal.status === 'diterima'
          ? 'Telah Diterima di Posko'
          : 'Terdaftar';

    const message = `Assalamu'alaikum Bapak/Ibu *${shohibul.nama}*,%0A%0A` +
      `Berikut update dokumentasi hewan Qurban Anda di *Masjid As Sakinah Pantai Mentari 1447H*:%0A%0A` +
      `*Detail Hewan Qurban:*%0A` +
      `- Kode Hewan: *${animal.kode}*%0A` +
      `- Jenis: *${animal.jenis.toUpperCase()}*%0A` +
      `- Status: *${statusText}*%0A` +
      (animal.bobot ? `- Bobot Hidup: *${Math.round(animal.bobot)} kg*%0A` : '') +
      `%0A` +
      `Dokumentasi foto (saat hidup & penyembelihan) dapat dilihat secara langsung di portal kami:%0A` +
      `https://qurban1447h.vercel.app/%0A%0A` +
      `_Jazakumullahu Khairan Katsiran._`;

    return `https://wa.me/${shohibul.noTelepon.replace(/^0/, '62')}?text=${message}`;
  };

  return (
    <>
      {/* Dynamic style tag for CSS media print overrides */}
      <style>{`
        @media print {
          /* Hide everything in the main body */
          body * {
            visibility: hidden;
          }
          /* Show dialog and its content */
          .fixed, [role="dialog"], #printable-modal-content, #printable-modal-content * {
            visibility: visible;
          }
          #printable-modal-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Hide elements during print */
          .print-hide {
            display: none !important;
          }
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl bg-white overflow-x-hidden scrollbar-thin">
          <div id="printable-modal-content" className="p-6 space-y-6">
            
            {/* Header - Masjid Info */}
            <div className="text-center border-b-2 border-slate-100 pb-4 space-y-1">
              <h1 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-wide leading-tight">
                PANITIA QURBAN MASJID AS SAKINAH
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-600 tracking-wider">
                PANTAI MENTARI SURABAYA
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5" />
                <span>Tahun 1447 Hijriah</span>
                <span className="mx-1">•</span>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Dokumentasi Qurban</span>
              </div>
            </div>

            {/* Animal Overview & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kode Hewan</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-wider">{animal.kode}</span>
                  <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-200 font-bold uppercase text-[9px]">
                    {animal.jenis}
                  </Badge>
                  <Badge className={`font-bold uppercase text-[9px] ${
                    animal.status === 'dipotong' 
                      ? 'bg-emerald-600 text-white' 
                      : animal.status === 'disembelih' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-blue-600 text-white'
                  }`}>
                    {animal.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Bobot Hidup</span>
                  <span className="text-sm font-black text-slate-800">{animal.bobot ? `${Math.round(animal.bobot)} kg` : '-'}</span>
                </div>
                
                {/* WA button top right for single shohibul - ADMIN ONLY */}
                {showWhatsApp && (!isPatungan && shohibuls.length > 0 ? (
                  <a
                    href={getWhatsAppLink(shohibuls[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center print-hide transition-colors duration-200 shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" />
                    Kirim WA Shohibul
                  </a>
                ) : (
                  isPatungan && (
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right print-hide bg-slate-100 border px-2.5 py-1 rounded-md">
                      Kirim WA via List di Bawah
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Shohibul List (Print Style Menu) */}
            <div className="space-y-2">
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="bg-slate-150 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase text-slate-700 tracking-wider flex justify-between items-center">
                  <span>Daftar Shohibul / Pengqurban {isPatungan ? '(Kolektif)' : '(Mandiri)'}</span>
                  {animal.bobot && (
                    <span className="sm:hidden text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                      Bobot: {Math.round(animal.bobot)} kg
                    </span>
                  )}
                </div>
                
                {shohibuls.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-medium">
                    Hamba Allah
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {shohibuls.map((s, index) => (
                      <div key={s.id} className="px-4 py-2.5 text-xs flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-400 w-4">{index + 1}.</span>
                          <div>
                            <span className="font-extrabold text-slate-800 text-sm">{s.nama}</span>
                            <span className="text-[10px] text-slate-500 ml-2">({s.alamat})</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="text-[10px] text-slate-650 font-bold">
                            {s.noTelepon}
                          </span>
                          {showWhatsApp && (
                            <a
                              href={getWhatsAppLink(s)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold border border-emerald-250 transition-colors duration-200 print-hide text-[10px]"
                            >
                              <MessageCircle className="h-3.5 w-3.5 fill-emerald-700" />
                              <span>Kirim WA</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Photo Comparison Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-4 w-4 text-slate-450" />
                Dokumentasi Foto Qurban
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Live Animal Photo */}
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                  <div className="bg-slate-100 px-3 py-1.5 border-b font-extrabold text-[10px] uppercase text-slate-600 tracking-wider text-center">
                    Foto Hewan Saat Hidup
                  </div>
                  <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={livePhoto} 
                      alt="Hewan Saat Hidup" 
                      className={`w-full h-full object-cover ${!hasPhotos ? 'opacity-45' : ''}`}
                    />
                    {!hasPhotos && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                        <span className="bg-white/90 text-slate-600 border border-slate-200 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider">
                          Belum Ada Foto Real
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Slaughter Photo */}
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                  <div className="bg-slate-100 px-3 py-1.5 border-b font-extrabold text-[10px] uppercase text-slate-600 tracking-wider text-center">
                    Foto Menjelang Penyembelihan
                  </div>
                  <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {hasSlaughterPhoto && slaughterPhoto ? (
                      <img 
                        src={slaughterPhoto} 
                        alt="Hewan Menjelang Penyembelihan" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-250 m-2 rounded-lg bg-slate-50">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-2">
                          <Heart className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Proses Penyembelihan
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          Dokumentasi belum diunggah panitia
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Signature Area for printouts */}
            <div className="hidden print:flex justify-between items-end pt-12 text-xs">
              <div className="text-center w-36">
                <p className="font-bold">Mengetahui,</p>
                <p className="text-[10px] text-slate-500 mt-12">( Ketua Panitia )</p>
              </div>
              <div className="text-center w-36">
                <p className="font-bold">Masjid As Sakinah,</p>
                <p className="text-[10px] text-slate-500 mt-12">( Posko Penyembelihan )</p>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnimalDetailModal;
