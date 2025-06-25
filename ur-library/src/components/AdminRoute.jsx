import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return user && user.is_admin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;