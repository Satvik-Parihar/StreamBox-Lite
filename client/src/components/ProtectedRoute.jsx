import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) {
        // Wait until token check is complete
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" replace />;
    }

    // If token exists, show the child route (e.g., DashboardPage)
    return <Outlet />;
};

export default ProtectedRoute;