
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
  ChevronRight,
  FileText,
  UserCog,
  Truck,
  BarChart3,
  Camera,
  FileCheck,
  ClipboardList,
  Settings,
  Home
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
  menuItems: MenuItem[];
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const roles: Record<Role, RoleInfo> = {
  admin: { 
    name: "Admin", 
    icon: LayoutDashboard,
    description: "Akses penuh seluruh fitur dan data. Mengatur akun petugas. Monitoring progres real-time semua tahapan. Menyusun laporan akhir.",
    menuItems: [
      { name: "Dashboard", icon: Home, path: "/" },
      { name: "Manajemen Pengguna", icon: UserCog, path: "/admin/users" },
      { name: "Monitoring", icon: BarChart3, path: "/admin/monitoring" },
      { name: "Laporan", icon: FileCheck, path: "/admin/reports" },
      { name: "Pengaturan", icon: Settings, path: "/admin/settings" }
    ]
  },
  shohibul: { 
    name: "Petugas Shohibul", 
    icon: Users,
    description: "Input dan update data shohibul (nama, kontak, alamat, partisipasi). Memetakan lokasi shohibul. Validasi pembayaran/konfirmasi.",
    menuItems: [
      { name: "Dashboard", icon: Home, path: "/" },
      { name: "Data Shohibul", icon: FileText, path: "/shohibul/data" },
      { name: "Peta Lokasi", icon: MapPin, path: "/shohibul/map" },
      { name: "Pembayaran", icon: FileCheck, path: "/shohibul/payments" }
    ]
  },
  animal: { 
    name: "Petugas Hewan", 
    icon: Beef,
    description: "Input data hewan: jenis, identitas/tag. Update status hewan: diterima → disembelih → dipotong. Dokumentasi: foto/video penyembelihan.",
    menuItems: [
      { name: "Dashboard", icon: Home, path: "/" },
      { name: "Data Hewan", icon: FileText, path: "/animal/data" },
      { name: "Status Hewan", icon: ClipboardList, path: "/animal/status" },
      { name: "Dokumentasi", icon: Camera, path: "/animal/documentation" }
    ]
  },
  packaging: { 
    name: "Petugas Pengemasan", 
    icon: Package,
    description: "Input hasil pengemasan daging: paket sapi dan kambing. Jumlah kemasan & estimasi berat per paket. Status: dikemas / siap distribusi.",
    menuItems: [
      { name: "Dashboard", icon: Home, path: "/" },
      { name: "Data Pengemasan", icon: FileText, path: "/packaging/data" },
      { name: "Status Paket", icon: ClipboardList, path: "/packaging/status" }
    ]
  },
  distribution: { 
    name: "Petugas Distribusi", 
    icon: MapPin,
    description: "Input data penerima: nama, alamat, kluster wilayah. Jenis paket diterima: sapi/kambing. Status distribusi: terkirim / belum. Bukti terima: tanda tangan digital, foto.",
    menuItems: [
      { name: "Dashboard", icon: Home, path: "/" },
      { name: "Data Penerima", icon: FileText, path: "/distribution/recipients" },
      { name: "Rute Distribusi", icon: Truck, path: "/distribution/routes" },
      { name: "Status Pengiriman", icon: ClipboardList, path: "/distribution/status" }
    ]
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

      <div className="flex-1 py-4 overflow-y-auto flex flex-col">
        <div className="px-3 mb-2">
          {!collapsed && <p className="text-xs text-sidebar-foreground/60 mb-2 px-3">Peran</p>}
        </div>
        <TooltipProvider>
          <nav className="space-y-1 px-3 mb-6">
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
        
        {/* Role-specific menu items */}
        {!collapsed && <div className="px-3 mb-2">
          <p className="text-xs text-sidebar-foreground/60 mb-2 px-3">Menu</p>
        </div>}
        <TooltipProvider>
          <nav className="space-y-1 px-3 flex-1">
            {roles[activeRole].menuItems.map((item, index) => (
              <Tooltip key={index} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    asChild
                  >
                    <a href={item.path}>
                      <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
                      {!collapsed && <span>{item.name}</span>}
                    </a>
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="text-xs">
                    {item.name}
                  </TooltipContent>
                )}
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
