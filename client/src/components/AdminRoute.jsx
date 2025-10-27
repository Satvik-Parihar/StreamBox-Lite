import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        // If user is not an admin, send them to the regular dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // If user is an admin, show the child route (AdminDashboardPage)
    return <Outlet />;
};

export default AdminRoute;