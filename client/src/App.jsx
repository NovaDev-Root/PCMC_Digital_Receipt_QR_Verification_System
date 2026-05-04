// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateReceipt  from './pages/CreateReceipt';
import PublicReceipt  from './pages/PublicReceipt';
import OriginalReceiptView from './pages/OriginalReceiptView';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/receipt/:receiptId" element={<PublicReceipt />} />
          <Route path="/view-receipt/:receiptId" element={<OriginalReceiptView />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <PrivateRoute>
                <CreateReceipt />
              </PrivateRoute>
            }
          />

          {/* Redirects */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/"     element={<Navigate to="/admin/login" replace />} />
          <Route path="*"     element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
