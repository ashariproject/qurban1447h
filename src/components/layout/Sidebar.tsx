
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Users, 
  Beef, 
  MapPin,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define user roles for the sidebar
type Role = "admin" | "shohibul" | "animal" | "packaging" | "distribution";

interface RoleInfo {
  name: string;
  icon: React.ElementType;
  description: string;
}

const roles: Record<Role, RoleInfo> = {
  admin: { 
    name: "Admin", 
    icon: LayoutDashboard,
    description: "Akses penuh seluruh fitur dan data. Mengatur akun petugas. Monitoring progres real-time semua tahapan. Menyusun laporan akhir."
  },
  shohibul: { 
    name: "Petugas Shohibul", 
    icon: Users,
    description: "Input dan update data shohibul (nama, kontak, alamat, partisipasi). Memetakan lokasi shohibul. Validasi pembayaran/konfirmasi."
  },
  animal: { 
    name: "Petugas Hewan", 
    icon: Beef,
    description: "Input data hewan: jenis, identitas/tag. Update status hewan: diterima → disembelih → dipotong. Dokumentasi: foto/video penyembelihan."
  },
  packaging: { 
    name: "Petugas Pengemasan", 
    icon: Package,
    description: "Input hasil pengemasan daging: paket sapi dan kambing. Jumlah kemasan & estimasi berat per paket. Status: dikemas / siap distribusi."
  },
  distribution: { 
    name: "Petugas Distribusi", 
    icon: MapPin,
    description: "Input data penerima: nama, alamat, kluster wilayah. Jenis paket diterima: sapi/kambing. Status distribusi: terkirim / belum. Bukti terima: tanda tangan digital, foto."
  }
};

interface SidebarProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRole, onRoleChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-qurban-600 flex-1">QurbanKu</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2">
          {!collapsed && <p className="text-xs text-sidebar-foreground/60 mb-2 px-3">Peran</p>}
        </div>
        <TooltipProvider>
          <nav className="space-y-1 px-3">
            {Object.entries(roles).map(([key, { name, icon: Icon, description }]) => (
              <Tooltip key={key} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      activeRole === key
                        ? "bg-sidebar-accent text-qurban-600 font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => onRoleChange(key as Role)}
                  >
                    <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
                    {!collapsed && <span>{name}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs text-xs">
                  <p className="font-medium">{name}</p>
                  <p className="mt-1">{description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-qurban-100 flex items-center justify-center">
              <span className="font-semibold text-qurban-600">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin Qurban</p>
              <p className="text-xs text-sidebar-foreground/60">Akses Penuh</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
