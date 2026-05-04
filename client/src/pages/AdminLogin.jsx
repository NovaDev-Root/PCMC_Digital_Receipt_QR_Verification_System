// src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const PCMCLogoLarge = () => (
  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
    <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto object-contain" />
  </div>
);

export default function AdminLogin() {
  const { login, isMockMode } = useAuth();
  const navigate   = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password. Please try again.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2460] via-[#1a3a8f] to-[#1e40af] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a3a8f] to-[#2563eb] px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <PCMCLogoLarge />
            </div>
            <h1 className="text-white text-xl font-bold devanagari leading-snug">
              पिंपरी चिंचवड महानगरपालिका
            </h1>
            <p className="text-blue-200 text-sm mt-1">Pimpri Chinchwad Municipal Corporation</p>
            <div className="mt-3 inline-block bg-yellow-400/20 border border-yellow-300/40 rounded-lg px-4 py-1.5">
              <p className="text-yellow-200 text-xs font-semibold devanagari">
                झोपडपट्टी निर्मूलन — Admin Portal
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-[#1a3a8f] font-bold text-lg mb-1">Admin Sign In</h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter your credentials to access the admin panel.
            </p>

            {isMockMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-xs text-amber-800">
                <p className="font-bold mb-0.5">🔧 Demo Mode Active</p>
                <p>Email: <code className="bg-amber-100 px-1 rounded">admin@pcmc.gov.in</code></p>
                <p>Password: <code className="bg-amber-100 px-1 rounded">admin123</code></p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pcmc.gov.in"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              <button
                id="btn-login"
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a3a8f] hover:bg-[#0f2460] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/30 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  '🔐 Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              🛡️ Authorized personnel only. All actions are logged.
            </p>
          </div>
        </div>

        <p className="text-center text-blue-300/60 text-xs mt-4">
          © 2025 Pimpri Chinchwad Municipal Corporation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
