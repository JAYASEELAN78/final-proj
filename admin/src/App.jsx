import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';

// Lazy-loaded pages for new system
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const RawMaterialsPage = lazy(() => import('./pages/RawMaterialsPage'));
const ProductionPage = lazy(() => import('./pages/ProductionPage'));
const FinishedGoodsPage = lazy(() => import('./pages/FinishedGoodsPage'));
const DispatchPage = lazy(() => import('./pages/DispatchPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ItemsPage = lazy(() => import('./pages/ItemsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));

// ...

// Loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px' }}>
    <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#1e40af', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Simplified page transition — opacity only, fast
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
};

// Animated Page Wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{ width: '100%', height: '100%' }}
  >
    {children}
  </motion.div>
);

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          {/* Public Home Page - Always accessible */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AnimatedPage>
                  <LoginPage />
                </AnimatedPage>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <AnimatedPage>
                  <RegisterPage />
                </AnimatedPage>
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
            <Route path="companies" element={<Suspense fallback={<PageLoader />}><CompaniesPage /></Suspense>} />
            <Route path="orders" element={<Suspense fallback={<PageLoader />}><OrdersPage /></Suspense>} />
            <Route path="raw-materials" element={<Suspense fallback={<PageLoader />}><RawMaterialsPage /></Suspense>} />
            <Route path="production" element={<Suspense fallback={<PageLoader />}><ProductionPage /></Suspense>} />
            <Route path="finished-goods" element={<Suspense fallback={<PageLoader />}><FinishedGoodsPage /></Suspense>} />
            <Route path="dispatch" element={<Suspense fallback={<PageLoader />}><DispatchPage /></Suspense>} />
            <Route path="reports" element={<Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>} />
            <Route path="billing" element={<Suspense fallback={<PageLoader />}><BillingPage /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
            <Route path="items" element={<Suspense fallback={<PageLoader />}><ItemsPage /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<PageLoader />}><UsersPage /></Suspense>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen app-shell">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
