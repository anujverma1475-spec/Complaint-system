import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import NewComplaint from './pages/student/NewComplaint';
import ComplaintDetail from './pages/student/ComplaintDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail';

// Redirect based on role
const HomeRedirect = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Landing />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/complaints/new" element={
              <ProtectedRoute role="student">
                <NewComplaint />
              </ProtectedRoute>
            } />
            <Route path="/complaints/:id" element={
              <ProtectedRoute role="student">
                <ComplaintDetail />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute role="admin">
                <AdminComplaints />
              </ProtectedRoute>
            } />
            <Route path="/admin/complaints/:id" element={
              <ProtectedRoute role="admin">
                <AdminComplaintDetail />
              </ProtectedRoute>
            } />

            {/* Shared */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
