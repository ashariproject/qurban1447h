
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QurbanProvider } from "@/contexts/QurbanContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/Users";
import Monitoring from "./pages/admin/Monitoring";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

// Shohibul Pages
import ShohibulDashboard from "./pages/shohibul/Dashboard";
import ShohibulData from "./pages/shohibul/Data";
import LocationMap from "./pages/shohibul/Map";
import Payments from "./pages/shohibul/Payments";

// Animal Pages
import AnimalDashboard from "./pages/animal/Dashboard";
import AnimalData from "./pages/animal/Data";
import AnimalStatus from "./pages/animal/Status";
import Documentation from "./pages/animal/Documentation";

// Packaging Pages
import PackagingDashboard from "./pages/packaging/Dashboard";
import PackagingData from "./pages/packaging/Data";

// Distribution Pages
import DistributionDashboard from "./pages/distribution/Dashboard";
import Recipients from "./pages/distribution/Recipients";
import DistributionRoutes from "./pages/distribution/Routes";
import DeliveryStatus from "./pages/distribution/Status";

// Integration Pages
import GoogleSheetsIntegration from "./pages/integration/GoogleSheets";
import HewanFotoQR from "./pages/animal/FotoQR";
import HewanDetail from "./pages/HewanDetail";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QurbanProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/monitoring" element={<Monitoring />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            
            {/* Shohibul Routes */}
            <Route path="/shohibul/data" element={<ShohibulData />} />
            <Route path="/shohibul/map" element={<LocationMap />} />
            <Route path="/shohibul/payments" element={<Payments />} />
            
            {/* Animal Routes */}
            <Route path="/animal/data" element={<AnimalData />} />
            <Route path="/animal/status" element={<AnimalStatus />} />
            <Route path="/animal/documentation" element={<Documentation />} />
            <Route path="/animal/foto-qr" element={<HewanFotoQR />} />
            <Route path="/hewan/:id" element={<HewanDetail />} />
            
            {/* Packaging Routes */}
            <Route path="/packaging/data" element={<PackagingData />} />
            
            {/* Distribution Routes */}
            <Route path="/distribution/recipients" element={<Recipients />} />
            <Route path="/distribution/routes" element={<DistributionRoutes />} />
            <Route path="/distribution/status" element={<DeliveryStatus />} />
            
            {/* Integration Routes */}
            <Route path="/integration/google-sheets" element={<GoogleSheetsIntegration />} />

            {/* Help Route */}
            <Route path="/help" element={<Help />} />
            
            {/* Dashboard routes for each role */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/shohibul" element={<ShohibulDashboard />} />
            <Route path="/animal" element={<AnimalDashboard />} />
            <Route path="/packaging" element={<PackagingDashboard />} />
            <Route path="/distribution" element={<DistributionDashboard />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QurbanProvider>
  </QueryClientProvider>
);

export default App;
