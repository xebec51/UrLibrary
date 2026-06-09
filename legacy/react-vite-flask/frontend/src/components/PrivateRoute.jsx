// mengimpor komponen untuk navigasi dan routing dari react-router-dom
import { Navigate, Outlet } from 'react-router-dom';
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from '../context/AuthContext';

// komponen untuk melindungi rute yang memerlukan autentikasi user
const PrivateRoute = () => {
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

    // jika user sudah login tampilkan konten, jika tidak redirect ke halaman login user
    return user ? <Outlet /> : <Navigate to="/login-user" replace />;
};

export default PrivateRoute;