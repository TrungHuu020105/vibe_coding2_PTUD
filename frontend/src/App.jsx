import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { me } from './api/auth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CategoriesPage from './pages/CategoriesPage';
import CopiesPage from './pages/CopiesPage';
import DashboardPage from './pages/DashboardPage';
import LoansPage from './pages/LoansPage';
import LoginPage from './pages/LoginPage';
import ReadersPage from './pages/ReadersPage';
import ReportsPage from './pages/ReportsPage';
import TitlesPage from './pages/TitlesPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const refreshMe = async () => {
    const tk = localStorage.getItem('token');
    setToken(tk);
    if (tk) {
      try {
        const profile = await me();
        setUser(profile);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLoginSuccess={refreshMe} />} />
      <Route
        path="*"
        element={
          <ProtectedRoute token={token}>
            <Layout user={user}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage user={user} />} />
                <Route path="/readers" element={<ReadersPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/titles" element={<TitlesPage />} />
                <Route path="/copies" element={<CopiesPage />} />
                <Route path="/loans" element={<LoansPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/users" element={user?.role === 'admin' ? <UsersPage /> : <Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
