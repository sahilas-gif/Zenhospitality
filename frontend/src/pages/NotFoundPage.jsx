import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
    <div className="text-center px-4 py-20">
      <h1 className="text-8xl md:text-9xl font-bold font-playfair text-emerald-500 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all">
          <Home className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <button onClick={() => window.history.back()} className="inline-flex items-center px-6 py-3 glass-card hover:bg-white/10 text-white rounded-full font-medium transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </button>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
