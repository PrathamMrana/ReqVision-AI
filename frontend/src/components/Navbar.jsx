import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <nav className="sticky top-0 z-50 w-full glass-card rounded-none border-b border-white/20 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900">
                ReqVision <span className="text-primary-600">AI</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
              Dashboard
            </Link>
            <a 
              href="https://github.com/PrathamMrana/ReqVision-AI"
              target="_blank" 
              rel="noreferrer"
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary-500/30"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
