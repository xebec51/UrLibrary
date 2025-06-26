import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Jika user sudah login (ada data user), izinkan akses.
    // Jika tidak, arahkan ke halaman login user.
    return user ? <Outlet /> : <Navigate to="/login-user" replace />;
};

export default PrivateRoute;