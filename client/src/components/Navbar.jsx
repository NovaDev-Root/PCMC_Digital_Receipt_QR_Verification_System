// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Only show admin navbar on admin pages
  if (!location.pathname.startsWith('/admin') || !user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1a3a8f] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto object-contain" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm devanagari">
                पिंपरी चिंचवड महानगरपालिका
              </p>
              <p className="text-blue-300 text-[10px] uppercase font-bold tracking-widest">Admin Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/admin/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/admin/dashboard')
                  ? 'bg-white/15 text-yellow-300 shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              📋 Dashboard
            </Link>
            <Link
              to="/admin/create"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/admin/create')
                  ? 'bg-white/15 text-yellow-300 shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              ➕ नवीन बील
            </Link>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-white text-[11px] font-bold opacity-90">{user?.email}</p>
              <span className="text-[9px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded border border-green-500/30 uppercase font-black">Authorized</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-red-500/30 active:scale-95"
            >
              LOGOUT
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f2460] border-t border-white/10 py-2 animate-fade-in">
          <Link
            to="/admin/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-6 py-3 text-white font-bold devanagari border-b border-white/5"
          >
            📋 डॅशबोर्ड (Dashboard)
          </Link>
          <Link
            to="/admin/create"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-6 py-3 text-white font-bold devanagari"
          >
            ➕ नवीन बील (New Bill)
          </Link>
        </div>
      )}
    </nav>
  );
}
