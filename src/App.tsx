import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { GuestProvider } from './context/GuestContext';
import { ChatProvider } from './context/ChatContext';
import { AuthPage } from './pages/AuthPage';
import { ChatPage } from './pages/ChatPage';
import { PaymentPage } from './pages/PaymentPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';
import { useAuth } from './context/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user?.isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route 
        path="/auth" 
        element={<AuthPage />}
      />
      <Route 
        path="/" 
        element={
          <GuestProvider>
            <ChatProvider>
              <ChatPage />
            </ChatProvider>
          </GuestProvider>
        } 
      />
      <Route 
        path="/payment" 
        element={
          isAuthenticated ? (
            <PaymentPage />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        } 
      />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/legal/:type" element={<LegalPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;