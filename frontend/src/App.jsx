import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConciergeDial from './components/ConciergeDial';
import ErrorBoundary from './components/ErrorBoundary';
import SmoothScroll from './components/motion/SmoothScroll';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CorporateTravelPage = lazy(() => import('./pages/CorporateTravelPage'));
const MicePage = lazy(() => import('./pages/MicePage'));
const RetailPage = lazy(() => import('./pages/RetailPage'));
const HotelManagementPage = lazy(() => import('./pages/HotelManagementPage'));
const DomesticToursPage = lazy(() => import('./pages/DomesticToursPage'));
const TourDetailPage = lazy(() => import('./pages/TourDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TransportationPage = lazy(() => import('./pages/TransportationPage'));
const InternationalToursPage = lazy(() => import('./pages/InternationalToursPage'));
const FlightTicketingPage = lazy(() => import('./pages/FlightTicketingPage'));
const HotelsPage = lazy(() => import('./pages/HotelsPage'));
const HotelDetailPage = lazy(() => import('./pages/HotelDetailPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-label="Loading">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
  </div>
);

function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <SmoothScroll disabled={isAdminRoute} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink-950">
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col bg-ink-950 text-pearl">
          {!isAdminRoute && <Navbar />}
          <main id="main" className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/hotels/:slug" element={<HotelDetailPage />} />
                <Route path="/plan-trip" element={<PlannerPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/corporate" element={<CorporateTravelPage />} />
                <Route path="/services/mice" element={<MicePage />} />
                <Route path="/services/retail" element={<RetailPage />} />
                <Route path="/services/hotel-management" element={<HotelManagementPage />} />
                <Route path="/domestic-tours" element={<DomesticToursPage />} />
                <Route path="/domestic-tours/:state" element={<TourDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/transportation" element={<TransportationPage />} />
                <Route path="/international-tours" element={<InternationalToursPage />} />
                <Route path="/flight-ticketing" element={<FlightTicketingPage />} />
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
          {!isAdminRoute && <ConciergeDial />}
          {!isAdminRoute && <Footer />}
        </div>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
