import { lazy, Suspense, useEffect, ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QurbanProvider } from "@/contexts/QurbanContext";
import Index from "./pages/Index";

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
const AdminSheetsSync = lazyWithPreload(() => import("./pages/admin/SheetsSync"));
const ShohibulDashboard = lazyWithPreload(() => import("./pages/shohibul/Dashboard"));
const ShohibulData = lazyWithPreload(() => import("./pages/shohibul/Data"));
const LocationMap = lazyWithPreload(() => import("./pages/shohibul/Map"));
const Payments = lazyWithPreload(() => import("./pages/shohibul/Payments"));
const AnimalDashboard = lazyWithPreload(() => import("./pages/animal/Dashboard"));
const AnimalData = lazyWithPreload(() => import("./pages/animal/Data"));
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
  "/admin": [UsersManagement, Monitoring, Reports, Settings, AdminSheetsSync],
  "/shohibul": [ShohibulData, Payments, LocationMap],
  "/animal": [AnimalData, AnimalStatus, HewanFotoQR, Documentation],
  "/packaging": [PackagingData],
  "/distribution": [Recipients, DistributionRoutes, DeliveryStatus],
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
          <RoutePrefetcher />
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
