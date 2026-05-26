
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Heart, 
  Info, 
  Calendar, 
  MapPin, 
  Phone, 
  LayoutDashboard, 
  LogIn,
  ChevronDown,
  Play,
  Beef
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQurban } from '@/contexts/QurbanContext';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { toast } = useToast();
  const { animalData } = useQurban();
  const { isAuthenticated, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    whatsapp: '',
    paket: ''
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      };
      setCurrentDateTime(now.toLocaleDateString('id-ID', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const heroImages = [
    {
      src: "/images/qurban_berkah_cartoon.jpg",
      sub: "Selamat Idul Adha",
      title: "Qurban Berkah As Sakinah"
    },
    {
      src: "/images/live_monitoring_banner.jpg",
      sub: "Qurban Berkah",
      title: "Live Monitoring"
    },
    {
      src: "/images/live_monitoring_banner2.jpg",
      sub: "Qurban Berkah",
      title: "Live Streaming"
    }
  ];

  const [currentHeroImageIdx, setCurrentHeroImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);


  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.whatsapp || !formData.paket) {
      toast({
        variant: "destructive",
        title: "Data Belum Lengkap",
        description: "Mohon lengkapi Nama, WhatsApp, dan Pilihan Paket.",
      });
      return;
    }

    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh,%0A%0A` +
      `*PENDAFTARAN QURBAN 1447H - MASJID AS SAKINAH*%0A%0A` +
      `*Nama:* ${formData.nama}%0A` +
      `*Alamat:* ${formData.alamat || '-'}%0A` +
      `*No HP/WA:* ${formData.whatsapp}%0A` +
      `*Pilihan Paket:* ${formData.paket}%0A%0A` +
      `Mohon dibantu proses lebih lanjut. Terima kasih.`;

    const waLink = `https://wa.me/6289529788057?text=${message}`;
    window.open(waLink, '_blank');
    setIsDialogOpen(false);
    
    toast({
      title: "Menuju WhatsApp Center",
      description: "Sistem sedang mengalihkan Anda ke WhatsApp panitia.",
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 h-14 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="Logo"
              className="h-10 w-auto"
            />
            <div className="hidden md:block">
              <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">AS SAKINAH</span>
              <p className="text-[10px] font-bold text-slate-400 -mt-1 uppercase tracking-widest">Pantai Mentari Surabaya</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#about" className="hover:text-emerald-600 transition-colors">Tentang</a>
            <a href="#ayat" className="hover:text-emerald-600 transition-colors">Dalil</a>
            <Link to="/portal" className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 font-bold">
              Monitoring Live
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button asChild variant="ghost" className="hidden md:flex text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                <Link to={user?.role === 'admin' ? '/admin' : `/${user?.role}`}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" className="hidden md:flex text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login Petugas
                </Link>
              </Button>
            )}
            
            {isAuthenticated ? (
              <Button asChild variant="ghost" size="icon" className="md:hidden text-slate-500">
                <Link to={user?.role === 'admin' ? '/admin' : `/${user?.role}`}><LayoutDashboard className="h-5 w-5" /></Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="icon" className="md:hidden text-slate-500">
                <Link to="/login"><LogIn className="h-5 w-5" /></Link>
              </Button>
            )}
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 md:px-6 text-sm rounded-full shadow-lg shadow-emerald-200"
            >
              Daftar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-8 md:pt-28 md:pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 -z-10 rounded-l-[100px] hidden lg:block" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
            <div className="lg:w-1/2 space-y-4 md:space-y-5">
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-bounce">
                Idul Adha 1447H / 2026
              </Badge>

              {/* Thin Animal Stats Banner at the Top */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-3 space-y-2 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between border-b border-slate-700/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      HEWAN TERKUMPUL (LIVE)
                    </span>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono tracking-wider">
                    WIB
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* Sapi Box */}
                  <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-2.5 flex items-center gap-3 hover:bg-slate-800 transition-all duration-300">
                    <div className="h-8 w-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                      {/* Sapi Icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M6 18c0 1.5 1 2.5 2.5 2.5h7c1.5 0 2.5-1 2.5-2.5V11H6v7z" />
                        <path d="M5 8c0-2.5 3-4 7-4s7 1.5 7 4v3H5V8z" />
                        <path d="M4.5 9c-.5-.5-1.5-1-1.5-2s1-.5 2 0" />
                        <path d="M19.5 9c.5-.5 1.5-1 1.5-2s-1-.5-2 0" />
                        <path d="M8 5V3c0-.6-.4-1-1-1s-1 .4-1 1v2" />
                        <path d="M16 5V3c0-.6.4-1 1-1s1 .4 1 1v2" />
                        <ellipse cx="12" cy="17" rx="3" ry="1.5" />
                        <circle cx="10.5" cy="17" r="0.5" fill="currentColor" />
                        <circle cx="13.5" cy="17" r="0.5" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SAPI</div>
                      <div className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {animalData.totalSapi} <span className="text-[9px] font-bold text-slate-400">EKOR</span>
                      </div>
                    </div>
                  </div>

                  {/* Kambing Box */}
                  <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-2.5 flex items-center gap-3 hover:bg-slate-800 transition-all duration-300">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      {/* Kambing Icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M7 16V9l5-5 5 5v7l-2.5 3.5h-5L7 16z" />
                        <path d="M9 5C7.5 4 6 2 6 1" />
                        <path d="M15 5C16.5 4 18 2 18 1" />
                        <path d="M6 9c-1 0-2 1-2 2.5s.5 2 1.5 1" />
                        <path d="M18 9c1 0 2 1 2 2.5s-.5 2-1.5 1" />
                        <circle cx="10" cy="10" r="0.75" fill="currentColor" />
                        <circle cx="14" cy="10" r="0.75" fill="currentColor" />
                        <path d="M11 19.5l1 1.5 1-1.5" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">KAMBING</div>
                      <div className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {animalData.totalKambing} <span className="text-[9px] font-bold text-slate-400">EKOR</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clock / Time */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 bg-slate-800/70 py-1.5 px-3 rounded-lg border border-slate-700/40">
                  <Calendar className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentDateTime || 'Memuat waktu...'}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Sempurnakan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">Ibadah Qurban</span> <br />
                Bersama Kami.
              </h1>
              <p className="text-base text-slate-500 max-w-lg leading-relaxed font-medium">
                Masjid As Sakinah Pantai Mentari Surabaya memfasilitasi pelaksanaan ibadah Qurban Anda dengan amanah, transparan, dan profesional.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 md:h-12 px-6 rounded-xl shadow-xl shadow-slate-200 group">
                  <Link to="/portal" className="flex items-center">
                    LIHAT PROGRESS LIVE
                    <span className="relative flex h-2 w-2 ml-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <LayoutDashboard className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-slate-100 h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
                {heroImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      idx === currentHeroImageIdx ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white z-20">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{img.sub}</p>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{img.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/50 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Verse Section */}
      <section id="ayat" className="py-8 md:py-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <div className="space-y-4">
              <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm">Firman Allah SWT</p>
              <h2 className="text-3xl font-black tracking-tight lg:text-4xl">Daging dan darah itu tidak akan sampai kepada Allah...</h2>
            </div>
            
            <div className="space-y-6 bg-white/5 backdrop-blur-lg p-6 md:p-12 rounded-[30px] md:rounded-[50px] border border-white/10 shadow-2xl">
              <p className="text-3xl md:text-4xl lg:text-6xl font-arabic leading-loose text-emerald-200 mb-4 md:mb-8" dir="rtl">
                فَصَلِّ لِرَبِّكَ وَانْحَرْۗ
              </p>
              <p className="text-base md:text-xl lg:text-2xl font-medium italic text-slate-300 leading-relaxed">
                "Maka dirikanlah shalat karena Tuhanmu; dan berqurbanlah."
              </p>
              <div className="h-px w-20 bg-emerald-500 mx-auto" />
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-500">QS. AL-KAWTAR: 2</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-6 md:pt-12">
              <div className="space-y-4">
                <p className="text-slate-400 text-sm leading-relaxed">
                  "Daging-daging unta dan darahnya itu sekali-kali tidak dapat mencapai (keridhaan) Allah, tetapi ketakwaan darimulah yang dapat mencapainya."
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">QS. AL-HAJJ: 37</p>
              </div>
              <div className="space-y-4 md:border-l border-white/10 md:pl-8">
                <p className="text-slate-400 text-sm leading-relaxed">
                  "Berkata para sahabat: Wahai Rasulullah, apakah Qurban itu? Rasulullah menjawab: Qurban adalah Sunnah bapak kalian, Nabi Ibrahim AS."
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">HR. AHMAD & IBNU MAJAH</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation 2025 */}
      <section id="documentation" className="py-8 md:py-12 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/3 space-y-4 w-full">
              <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Flashback Qurban 1446H
              </Badge>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase leading-tight">
                Dokumentasi <br />
                <span className="text-blue-600">Tahun Lalu (2025)</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Kilasan proses pelaksanaan Qurban tahun lalu di Masjid As Sakinah. Komitmen kami terhadap transparansi dan amanah telah berjalan dari tahun ke tahun.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dilihat oleh 1,000+ Warga</p>
              </div>
            </div>

            <div className="lg:w-2/3 relative group w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[40px] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700" />
              <div className="relative w-full rounded-[20px] md:rounded-[30px] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-slate-900" style={{paddingBottom: '56.25%', height: 0}}>
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/n-7nowHaBgY?playsinline=1" 
                  title="Dokumentasi Qurban 2025" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Play className="h-5 w-5 text-red-600 fill-red-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Official</p>
                  <p className="text-xs font-bold text-slate-900">Highlights Qurban 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section id="features" className="py-8 md:py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14 space-y-3">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Keunggulan Layanan Kami</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Pilih paket qurban yang sesuai dengan kebutuhan Anda. Kami menjamin pengelolaan yang higienis dan tepat sasaran.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl shadow-slate-200 border border-slate-100 hover:scale-105 transition-transform duration-500 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 md:mb-8 group-hover:rotate-12 transition-transform">
                <LayoutDashboard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter flex items-center gap-2">
                Monitoring Live
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase animate-pulse">
                  ● LIVE
                </span>
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Pantau proses penyembelihan, penimbangan, hingga pendistribusian secara real-time melalui dashboard interaktif kami.
              </p>
              <Button asChild variant="link" className="text-blue-600 font-bold p-0 group-hover:translate-x-2 transition-transform">
                <Link to="/portal">Cek Sekarang <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl shadow-slate-200 border border-slate-100 hover:scale-105 transition-transform duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black tracking-[0.2em] uppercase">Populer</div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5 md:mb-8 group-hover:rotate-12 transition-transform">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Amanah & Transparan</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Laporan lengkap disertai dokumentasi foto dan video untuk setiap hewan qurban yang diserahkan melalui panitia.
              </p>
              <Button asChild variant="link" className="text-emerald-600 font-bold p-0 group-hover:translate-x-2 transition-transform">
                <a href="#about">Info Selengkapnya <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl shadow-slate-200 border border-slate-100 hover:scale-105 transition-transform duration-500 group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-5 md:mb-8 group-hover:rotate-12 transition-transform">
                <Info className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Pendistribusian</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Penyaluran daging qurban diutamakan bagi warga di sekitar Pantai Mentari dan kaum dhuafa yang membutuhkan di Surabaya.
              </p>
              <Button asChild variant="link" className="text-orange-600 font-bold p-0 group-hover:translate-x-2 transition-transform">
                <a href="#about">Alur Distribusi <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="paket" className="py-8 md:py-12 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14 space-y-3">
            <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Daftar Harga 1447H
            </Badge>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Paket Qurban 1447H</h2>
            <p className="text-slate-500 font-medium">Berikut adalah rincian biaya operasional dan paket pengadaan hewan qurban.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {/* Sapi Mandiri */}
            <div className="bg-slate-50 p-5 md:p-8 rounded-[20px] md:rounded-[30px] border border-slate-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
              <div>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4">Sapi Mandiri</p>
                <h4 className="text-3xl font-black text-slate-900 mb-2">Rp 1.4 jt</h4>
                <p className="text-xs text-slate-400 font-bold mb-4">BIAYA OPERASIONAL</p>
                <ul className="space-y-2 mb-5 hidden sm:block">
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    Penyembelihan & Pencacahan
                  </li>
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    Pengemasan Higienis
                  </li>
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    Distribusi Amanah
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, paket: 'Sapi Mandiri (Operasional)' }));
                  setIsDialogOpen(true);
                }}
                className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold h-12 rounded-xl transition-colors"
              >
                Daftar
              </Button>
            </div>

            {/* Sapi Patungan */}
            <div className="bg-slate-900 p-5 md:p-8 rounded-[20px] md:rounded-[30px] border border-slate-800 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-[8px] font-black tracking-widest uppercase">Paling Dicari</div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Sapi Patungan</p>
                <h4 className="text-3xl font-black text-white mb-2">Rp 3.5 jt</h4>
                <p className="text-xs text-slate-500 font-bold mb-4">ALL-IN (1/7 SAPI)</p>
                <ul className="space-y-2 mb-5 hidden sm:block">
                  <li className="text-[11px] font-medium text-slate-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Pengadaan Hewan
                  </li>
                  <li className="text-[11px] font-medium text-slate-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Biaya Operasional
                  </li>
                  <li className="text-[11px] font-medium text-slate-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Laporan Dokumentasi
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, paket: 'Sapi Patungan (Kolektif)' }));
                  setIsDialogOpen(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-colors"
              >
                Daftar
              </Button>
            </div>

            {/* Kambing Titip Beli */}
            <div className="bg-slate-50 p-5 md:p-8 rounded-[20px] md:rounded-[30px] border border-slate-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Kambing Titip Beli</p>
                <h4 className="text-3xl font-black text-slate-900 mb-2">Rp 3.5 jt</h4>
                <p className="text-xs text-slate-400 font-bold mb-4">HEWAN + OPERASIONAL</p>
                <ul className="space-y-2 mb-5 hidden sm:block">
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Pengadaan Hewan
                  </li>
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Biaya Operasional
                  </li>
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Distribusi Wilayah
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, paket: 'Kambing Titip Beli' }));
                  setIsDialogOpen(true);
                }}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl transition-colors"
              >
                Daftar
              </Button>
            </div>

            {/* Kambing Mandiri */}
            <div className="bg-slate-50 p-5 md:p-8 rounded-[20px] md:rounded-[30px] border border-slate-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4">Kambing Mandiri</p>
                <h4 className="text-3xl font-black text-slate-900 mb-2">Rp 400 rb</h4>
                <p className="text-xs text-slate-400 font-bold mb-4">BIAYA OPERASIONAL</p>
                <ul className="space-y-2 mb-5 hidden sm:block">
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Penyembelihan
                  </li>
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Pengemasan
                  </li>
                  <li className="text-[11px] font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Distribusi
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, paket: 'Kambing Mandiri (Operasional)' }));
                  setIsDialogOpen(true);
                }}
                className="w-full bg-slate-900 hover:bg-purple-600 text-white font-bold h-12 rounded-xl transition-colors"
              >
                Daftar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-10 md:py-16 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 md:mb-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/logo.png" 
                  alt="Logo"
                  className="h-12 w-auto"
                />
                <h3 className="text-xl font-black tracking-tighter uppercase">Masjid As Sakinah</h3>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm font-medium">
                Membangun keberkahan di setiap langkah ibadah. Kami hadir untuk melayani umat dengan profesionalitas dan ketulusan.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <Phone className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Menu Cepat</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <li><a href="#" className="hover:text-emerald-600">Beranda</a></li>
                <li><Link to="/portal" className="hover:text-emerald-600">Portal Monitoring</Link></li>
                <li><a href="#ayat" className="hover:text-emerald-600">Dalil Qurban</a></li>
                <li><a href="#paket" className="hover:text-emerald-600">Informasi Harga</a></li>
                <li><a href="#documentation" className="hover:text-emerald-600">Dokumentasi 2025</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Kontak Kami</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                <li className="flex items-center gap-2 italic">
                  <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                  Perum. Pantai Mentari, Kenjeran, Bulak, Surabaya
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  +62 895-2978-8057 (WA Centre)
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              &copy; 2026 MASJID AS SAKINAH PANTAI MENTARI. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-900">Privacy</a>
              <a href="#" className="hover:text-slate-900">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[30px] border-none shadow-2xl overflow-hidden p-0">
          <div className="bg-emerald-600 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Daftar Qurban Sekarang</DialogTitle>
              <DialogDescription className="text-emerald-100 font-medium">
                Lengkapi data Anda untuk pendaftaran Qurban 1447H.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <form onSubmit={handleWhatsAppSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Lengkap</Label>
                <Input 
                  id="nama" 
                  placeholder="Masukkan nama sesuai KTP" 
                  className="rounded-xl border-slate-100 h-12 font-medium"
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alamat" className="text-xs font-black uppercase tracking-widest text-slate-400">Alamat</Label>
                <Textarea 
                  id="alamat" 
                  placeholder="Alamat lengkap penjemputan/pengiriman" 
                  className="rounded-xl border-slate-100 min-h-[80px] font-medium"
                  value={formData.alamat}
                  onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-xs font-black uppercase tracking-widest text-slate-400">No. HP / WhatsApp (Kontak Utama)</Label>
                <Input 
                  id="whatsapp" 
                  placeholder="Contoh: 08123456789" 
                  className="rounded-xl border-slate-100 h-12 font-medium"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paket" className="text-xs font-black uppercase tracking-widest text-slate-400">Pilihan Paket Qurban</Label>
                <Select 
                  value={formData.paket} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, paket: val }))}
                >
                  <SelectTrigger className="rounded-xl border-slate-100 h-12 font-medium">
                    <SelectValue placeholder="Pilih paket qurban" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="Sapi Mandiri (Operasional)">Sapi Mandiri (Operasional)</SelectItem>
                    <SelectItem value="Sapi Patungan (Kolektif)">Sapi Patungan (Kolektif)</SelectItem>
                    <SelectItem value="Kambing Titip Beli">Kambing Titip Beli</SelectItem>
                    <SelectItem value="Kambing Mandiri (Operasional)">Kambing Mandiri (Operasional)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[11px] font-bold text-blue-700 leading-relaxed italic">
                * Petugas kami akan segera menghubungi Anda setelah formulir ini dikirimkan ke WhatsApp Center.
              </p>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                KIRIM KE WHATSAPP CENTRE
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
