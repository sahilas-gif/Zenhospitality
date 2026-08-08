import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CorporateTravelPage = lazy(() => import('./pages/CorporateTravelPage'));
const MicePage = lazy(() => import('./pages/MicePage'));
const RetailPage = lazy(() => import('./pages/RetailPage'));
const HotelManagementPage = lazy(() => import('./pages/HotelManagementPage'));
const DomesticToursPage = lazy(() => import('./pages/DomesticToursPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import { useLocation } from 'react-router-dom';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0f1c]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#0a0f1c] text-white">
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/corporate" element={<CorporateTravelPage />} />
              <Route path="/services/mice" element={<MicePage />} />
              <Route path="/services/retail" element={<RetailPage />} />
              <Route path="/services/hotel-management" element={<HotelManagementPage />} />
              <Route path="/domestic-tours" element={<DomesticToursPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        {!isAdminRoute && <ChatWidget />}
        {!isAdminRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
