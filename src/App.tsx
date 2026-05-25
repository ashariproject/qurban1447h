import { lazy, Suspense, useEffect, ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QurbanProvider } from "@/contexts/QurbanContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

// Lazy with prefetch helper — lets us call Component.preload() to warm the chunk
type Preloadable<T extends ComponentType<any>> = React.LazyExoticComponent<T> & {
  preload: () => Promise<unknown>;
};

const lazyWithPreload = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): Preloadable<T> => {
  const Component = lazy(factory) as Preloadable<T>;
  Component.preload = factory;
  return Component;
};

const NotFound = lazyWithPreload(() => import("./pages/NotFound"));
const AdminDashboard = lazyWithPreload(() => import("./pages/admin/Dashboard"));
const UsersManagement = lazyWithPreload(() => import("./pages/admin/Users"));
const Monitoring = lazyWithPreload(() => import("./pages/admin/Monitoring"));
const Reports = lazyWithPreload(() => import("./pages/admin/Reports"));
const Settings = lazyWithPreload(() => import("./pages/admin/Settings"));
const AdminDatabase = lazyWithPreload(() => import("./pages/admin/Database"));
const AdminSheetsSync = lazyWithPreload(() => import("./pages/admin/SheetsSync"));
const ShohibulDashboard = lazyWithPreload(() => import("./pages/shohibul/Dashboard"));
const ShohibulData = lazyWithPreload(() => import("./pages/shohibul/Data"));
const LocationMap = lazyWithPreload(() => import("./pages/shohibul/Map"));
const Payments = lazyWithPreload(() => import("./pages/shohibul/Payments"));
const AnimalDashboard = lazyWithPreload(() => import("./pages/animal/Dashboard"));
const AnimalData = lazyWithPreload(() => import("./pages/animal/Data"));
const MeatYieldCalculator = lazyWithPreload(() => import("./pages/animal/MeatYieldCalculator"));
const AnimalStatus = lazyWithPreload(() => import("./pages/animal/Status"));
const Documentation = lazyWithPreload(() => import("./pages/animal/Documentation"));
const HewanFotoQR = lazyWithPreload(() => import("./pages/animal/FotoQR"));
const HewanDetail = lazyWithPreload(() => import("./pages/HewanDetail"));
const PackagingDashboard = lazyWithPreload(() => import("./pages/packaging/Dashboard"));
const PackagingData = lazyWithPreload(() => import("./pages/packaging/Data"));
const DistributionDashboard = lazyWithPreload(() => import("./pages/distribution/Dashboard"));
const Recipients = lazyWithPreload(() => import("./pages/distribution/Recipients"));
const DistributionRoutes = lazyWithPreload(() => import("./pages/distribution/Routes"));
const DeliveryStatus = lazyWithPreload(() => import("./pages/distribution/Status"));
const ShohibulDistribution = lazyWithPreload(() => import("./pages/distribution/ShohibulDistribution"));
const GoogleSheetsIntegration = lazyWithPreload(() => import("./pages/integration/GoogleSheets"));
const Help = lazyWithPreload(() => import("./pages/Help"));

// High-traffic dashboards prefetched on idle after initial load
const FREQUENT_ROUTES: Preloadable<any>[] = [
  AdminDashboard,
  ShohibulDashboard,
  ShohibulData,
  AnimalDashboard,
  AnimalData,
  PackagingDashboard,
  DistributionDashboard,
];

// Likely-next chunks per area, prefetched whenever the user enters that area
const ROUTE_PREFETCH_MAP: Record<string, Preloadable<any>[]> = {
  "/admin": [UsersManagement, Monitoring, Reports, Settings, AdminDatabase, AdminSheetsSync],
  "/shohibul": [ShohibulData, Payments, LocationMap],
  "/animal": [AnimalData, AnimalStatus, HewanFotoQR, Documentation, MeatYieldCalculator],
  "/packaging": [PackagingData],
  "/distribution": [Recipients, DistributionRoutes, DeliveryStatus, ShohibulDistribution],
};

const schedule = (cb: () => void) => {
  const w = window as any;
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 200);
  }
};

const prefetch = (components: Preloadable<any>[]) => {
  components.forEach((c) => {
    try {
      c.preload();
    } catch {
      /* ignore */
    }
  });
};

const RoutePrefetcher = () => {
  const { pathname } = useLocation();

  // Warm frequent routes once after initial mount
  useEffect(() => {
    schedule(() => prefetch(FREQUENT_ROUTES));
  }, []);

  // Warm related routes whenever the area changes
  useEffect(() => {
    const area = "/" + pathname.split("/")[1];
    const targets = ROUTE_PREFETCH_MAP[area];
    if (targets) schedule(() => prefetch(targets));
  }, [pathname]);

  return null;
};

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
  const { isAuthenticated } = useAuth();

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
        <Route path="/shohibul" element={<ProtectedRoute allowedRoles={['admin', 'shohibul', 'panitia']}><ShohibulDashboard /></ProtectedRoute>} />
        <Route path="/shohibul/data" element={<ProtectedRoute allowedRoles={['admin', 'shohibul', 'panitia']}><ShohibulData /></ProtectedRoute>} />
        <Route path="/shohibul/map" element={<ProtectedRoute allowedRoles={['admin', 'shohibul', 'panitia']}><LocationMap /></ProtectedRoute>} />
        <Route path="/shohibul/payments" element={<ProtectedRoute allowedRoles={['admin', 'shohibul']}><Payments /></ProtectedRoute>} />

        {/* Animal Routes */}
        <Route path="/animal" element={<ProtectedRoute allowedRoles={['admin', 'animal', 'panitia']}><AnimalDashboard /></ProtectedRoute>} />
        <Route path="/animal/data" element={<ProtectedRoute allowedRoles={['admin', 'animal', 'panitia']}><AnimalData /></ProtectedRoute>} />
        <Route path="/animal/status" element={<ProtectedRoute allowedRoles={['admin', 'animal', 'panitia']}><AnimalStatus /></ProtectedRoute>} />
        <Route path="/animal/documentation" element={<ProtectedRoute allowedRoles={['admin', 'animal', 'panitia']}><Documentation /></ProtectedRoute>} />

        <Route path="/animal/foto-qr" element={<ProtectedRoute allowedRoles={['admin', 'animal', 'panitia']}><HewanFotoQR /></ProtectedRoute>} />
        <Route path="/animal/meat-yield" element={<ProtectedRoute allowedRoles={['admin', 'animal', 'panitia']}><MeatYieldCalculator /></ProtectedRoute>} />
        <Route path="/hewan/:id" element={<ProtectedRoute><HewanDetail /></ProtectedRoute>} />

        {/* Packaging Routes */}
        <Route path="/packaging" element={<ProtectedRoute allowedRoles={['admin', 'packaging', 'panitia']}><PackagingDashboard /></ProtectedRoute>} />
        <Route path="/packaging/data" element={<ProtectedRoute allowedRoles={['admin', 'packaging', 'panitia']}><PackagingData /></ProtectedRoute>} />

        {/* Distribution Routes */}
        <Route path="/distribution" element={<ProtectedRoute allowedRoles={['admin', 'distribution', 'panitia']}><DistributionDashboard /></ProtectedRoute>} />
        <Route path="/distribution/recipients" element={<ProtectedRoute allowedRoles={['admin', 'distribution', 'panitia']}><Recipients /></ProtectedRoute>} />
        <Route path="/distribution/routes" element={<ProtectedRoute allowedRoles={['admin', 'distribution', 'panitia']}><DistributionRoutes /></ProtectedRoute>} />
        <Route path="/distribution/status" element={<ProtectedRoute allowedRoles={['admin', 'distribution', 'panitia']}><DeliveryStatus /></ProtectedRoute>} />
        <Route path="/distribution/shohibul" element={<ProtectedRoute allowedRoles={['admin', 'distribution', 'shohibul', 'panitia']}><ShohibulDistribution /></ProtectedRoute>} />

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
            <RoutePrefetcher />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QurbanProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
