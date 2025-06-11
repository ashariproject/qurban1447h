
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileSettings from '@/components/settings/UserProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import SystemSettings from '@/components/settings/SystemSettings';
import { User, Bell, Shield, Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Pengaturan</h1>
          <p className="text-gray-100">Kelola preferensi dan konfigurasi sistem Anda</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sistem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfileSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
