// mengimpor komponen untuk navigasi dan mendapatkan lokasi url saat ini
import { Link, useLocation } from "react-router-dom";
// mengimpor ikon buku dan user circle untuk ui navbar
import { FaBook, FaUserCircle } from "react-icons/fa"; // Pastikan FaUserCircle diimpor
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from "../context/AuthContext";

// komponen navigasi utama yang responsif untuk seluruh aplikasi
function Navbar() {
  // mendapatkan informasi lokasi url saat ini
  const location = useLocation();
  // mengambil data user dan fungsi logout dari konteks autentikasi
  const { user, logout } = useAuth();

  // fungsi untuk menangani proses logout dengan konfirmasi
  const handleLogout = () => {
    logout();
    alert('Anda telah berhasil logout.');
  };

  // mengecek apakah sedang berada di halaman admin
  const isAdminPage = location.pathname.startsWith('/admin');
  // mengecek apakah sedang berada di halaman autentikasi (login/register)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/login-user' || location.pathname === '/register';
  
  // menentukan class navbar berdasarkan jenis halaman (fixed untuk halaman biasa, tidak fixed untuk admin)
  const navbarClass = isAdminPage 
    ? "navbar bg-base-100 shadow-sm z-50 h-12" 
    : "navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50 h-12";

  return (
    <div className={navbarClass}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="w-full flex flex-row items-center justify-between">
          {/* bagian kiri navbar dengan logo dan menu utama */}
          <div className="flex flex-row items-center gap-8">
            {/* logo aplikasi dengan ikon buku */}
            <Link to="/" className="flex items-center gap-2 font-bold">
              <FaBook />
              <span>UrLibrary</span>
            </Link>
            {/* menu beranda yang tersembunyi di mobile */}
            <Link to="/" className="hidden md:block hover:text-primary transition-colors">
              Beranda
            </Link>
            {/* menu favorit yang hanya muncul jika user sudah login */}
            {user && (
              <Link to="/my-favorites" className="hidden md:block hover:text-primary transition-colors">
                Favorit Saya
              </Link>
            )}
          </div>
          
          {/* bagian kanan navbar dengan menu user dan admin */}
          <div className="flex items-center gap-3">
            {user ? (
              // tampilan menu setelah user login
              <>
                {/* tombol admin dashboard hanya muncul untuk admin */}
                {user.is_admin && (
                  <Link to="/admin/dashboard" className="btn btn-ghost btn-sm h-8 min-h-8 px-4">
                    Admin Dashboard
                  </Link>
                )}
                
                {/* menu dropdown profil user */}
                <div className="dropdown dropdown-end">
                  {/* tombol avatar untuk membuka dropdown */}
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full flex items-center justify-center">
                       <FaUserCircle size={28} className="text-gray-500" />
                    </div>
                  </label>
                  {/* konten dropdown dengan menu profil */}
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    {/* menampilkan nama user */}
                    <li className="px-4 py-2 font-bold text-base-content/60">{user.name}</li>
                    <div className="divider my-0"></div>
                    {/* menu edit profil */}
                    <li><Link to="/profile">Edit Profil</Link></li>
                    {/* tombol logout */}
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </>
            ) : (
              // tampilan menu sebelum user login (hanya di halaman non-admin dan non-auth)
              !isAdminPage && !isAuthPage && (
                <>
                  {/* tombol login user biasa */}
                  <Link to="/login-user" className="btn btn-ghost btn-sm h-8 min-h-8 px-4">
                    Login
                  </Link>
                  {/* tombol register */}
                  <Link to="/register" className="btn btn-primary btn-sm h-8 min-h-8 px-4">
                    Register
                  </Link>
                </>
              )
            )}
            
            {/* tombol login admin yang tersembunyi di mobile dan hanya muncul jika belum login */}
            {!user && !isAdminPage && !isAuthPage && (
               <Link to="/login" className="btn btn-outline btn-sm h-8 min-h-8 px-4 hidden md:flex">
                Login Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;