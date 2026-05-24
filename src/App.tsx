import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QurbanProvider, useQurban } from "@/contexts/QurbanContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

// Lazy-loaded pages for faster initial load
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const UsersManagement = lazy(() => import("./pages/admin/Users"));
const Monitoring = lazy(() => import("./pages/admin/Monitoring"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AdminDatabase = lazy(() => import("./pages/admin/Database"));
const AdminSheetsSync = lazy(() => import("./pages/admin/SheetsSync"));
const ShohibulDashboard = lazy(() => import("./pages/shohibul/Dashboard"));
const ShohibulData = lazy(() => import("./pages/shohibul/Data"));
const Payments = lazy(() => import("./pages/shohibul/Payments"));
const AnimalDashboard = lazy(() => import("./pages/animal/Dashboard"));
const AnimalData = lazy(() => import("./pages/animal/Data"));
const MeatYieldCalculator = lazy(() => import("./pages/animal/MeatYieldCalculator"));
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
const ShohibulDistribution = lazy(() => import("./pages/distribution/ShohibulDistribution"));
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

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qurban-600"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        {/* Home Route - Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Portal Route - Public Monitoring Dashboard */}
        <Route path="/portal" element={<Index />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersManagement /></ProtectedRoute>} />
        <Route path="/admin/monitoring" element={<ProtectedRoute allowedRoles={['admin']}><Monitoring /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
        <Route path="/admin/database" element={<ProtectedRoute allowedRoles={['admin']}><AdminDatabase /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
        <Route path="/admin/sheets-sync" element={<ProtectedRoute allowedRoles={['admin']}><AdminSheetsSync /></ProtectedRoute>} />

        {/* Shohibul Routes */}
        <Route path="/shohibul" element={<ProtectedRoute allowedRoles={['admin', 'shohibul']}><ShohibulDashboard /></ProtectedRoute>} />
        <Route path="/shohibul/data" element={<ProtectedRoute allowedRoles={['admin', 'shohibul']}><ShohibulData /></ProtectedRoute>} />
        <Route path="/shohibul/payments" element={<ProtectedRoute allowedRoles={['admin', 'shohibul']}><Payments /></ProtectedRoute>} />

        {/* Animal Routes */}
        <Route path="/animal" element={<ProtectedRoute allowedRoles={['admin', 'animal']}><AnimalDashboard /></ProtectedRoute>} />
        <Route path="/animal/data" element={<ProtectedRoute allowedRoles={['admin', 'animal']}><AnimalData /></ProtectedRoute>} />
        <Route path="/animal/status" element={<ProtectedRoute allowedRoles={['admin', 'animal']}><AnimalStatus /></ProtectedRoute>} />
        <Route path="/animal/documentation" element={<ProtectedRoute allowedRoles={['admin', 'animal']}><Documentation /></ProtectedRoute>} />
        <Route path="/animal/foto-qr" element={<ProtectedRoute allowedRoles={['admin', 'animal']}><HewanFotoQR /></ProtectedRoute>} />
        <Route path="/animal/meat-yield" element={<ProtectedRoute allowedRoles={['admin', 'animal']}><MeatYieldCalculator /></ProtectedRoute>} />
        <Route path="/hewan/:id" element={<ProtectedRoute><HewanDetail /></ProtectedRoute>} />

        {/* Packaging Routes */}
        <Route path="/packaging" element={<ProtectedRoute allowedRoles={['admin', 'packaging']}><PackagingDashboard /></ProtectedRoute>} />
        <Route path="/packaging/data" element={<ProtectedRoute allowedRoles={['admin', 'packaging']}><PackagingData /></ProtectedRoute>} />

        {/* Distribution Routes */}
        <Route path="/distribution" element={<ProtectedRoute allowedRoles={['admin', 'distribution']}><DistributionDashboard /></ProtectedRoute>} />
        <Route path="/distribution/recipients" element={<ProtectedRoute allowedRoles={['admin', 'distribution']}><Recipients /></ProtectedRoute>} />
        <Route path="/distribution/routes" element={<ProtectedRoute allowedRoles={['admin', 'distribution']}><DistributionRoutes /></ProtectedRoute>} />
        <Route path="/distribution/status" element={<ProtectedRoute allowedRoles={['admin', 'distribution']}><DeliveryStatus /></ProtectedRoute>} />
        <Route path="/distribution/shohibul" element={<ProtectedRoute allowedRoles={['admin', 'distribution', 'shohibul']}><ShohibulDistribution /></ProtectedRoute>} />

        {/* Integration Routes */}
        <Route path="/integration/google-sheets" element={<ProtectedRoute allowedRoles={['admin']}><GoogleSheetsIntegration /></ProtectedRoute>} />

        {/* Help Route */}
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QurbanProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QurbanProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
