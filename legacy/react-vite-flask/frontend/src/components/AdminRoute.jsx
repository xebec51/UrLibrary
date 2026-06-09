import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// komponen untuk melindungi rute yang hanya bisa diakses oleh admin
const AdminRoute = () => {
    // mengambil data user dan status loading dari konteks autentikasi
    const { user, authLoading } = useAuth();

    // menampilkan loading spinner saat proses autentikasi masih berlangsung
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // jika user adalah admin, tampilkan konten (outlet), jika tidak redirect ke halaman utama
    return user && user.is_admin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
