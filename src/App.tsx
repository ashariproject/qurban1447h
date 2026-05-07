import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QurbanProvider } from "@/contexts/QurbanContext";
import Index from "./pages/Index";

// Lazy-loaded pages for faster initial load
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const UsersManagement = lazy(() => import("./pages/admin/Users"));
const Monitoring = lazy(() => import("./pages/admin/Monitoring"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AdminSheetsSync = lazy(() => import("./pages/admin/SheetsSync"));
const ShohibulDashboard = lazy(() => import("./pages/shohibul/Dashboard"));
const ShohibulData = lazy(() => import("./pages/shohibul/Data"));
const LocationMap = lazy(() => import("./pages/shohibul/Map"));
const Payments = lazy(() => import("./pages/shohibul/Payments"));
const AnimalDashboard = lazy(() => import("./pages/animal/Dashboard"));
const AnimalData = lazy(() => import("./pages/animal/Data"));
const AnimalStatus = lazy(() => import("./pages/animal/Status"));
const Documentation = lazy(() => import("./pages/animal/Documentation"));
const HewanFotoQR = lazy(() => import("./pages/animal/FotoQR"));
const HewanDetail = lazy(() => import("./pages/HewanDetail"));
const PackagingDashboard = lazy(() => import("./pages/packaging/Dashboard"));
const PackagingData = lazy(() => import("./pages/packaging/Data"));
const DistributionDashboard = lazy(() => import("./pages/distribution/Dashboard"));
const Recipients = lazy(() => import("./pages/distribution/Recipients"));
const DistributionRoutes = lazy(() => import("./pages/distribution/Routes"));
const DeliveryStatus = lazy(() => import("./pages/distribution/Status"));
const GoogleSheetsIntegration = lazy(() => import("./pages/integration/GoogleSheets"));
const Help = lazy(() => import("./pages/Help"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QurbanProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Admin Routes */}
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/monitoring" element={<Monitoring />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/sheets-sync" element={<AdminSheetsSync />} />

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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QurbanProvider>
  </QueryClientProvider>
);

export default App;
