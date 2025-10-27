import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- NEW IMPORTS ---
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
// -------------------

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        

        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
export default App;