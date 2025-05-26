
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

type Role = "admin" | "shohibul" | "animal" | "packaging" | "distribution";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>("admin");
  const navigate = useNavigate();

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRole={activeRole} onRoleChange={setActiveRole} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <Button 
            onClick={handleBackToMain}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Kembali ke Menu Utama
          </Button>
          
          <Header title="DASHBOARD QURBAN AS SAKINAH PANTAI MENTARI" />
        </div>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
