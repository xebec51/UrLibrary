import { Link, useLocation } from "react-router-dom";
import { FaBook } from "react-icons/fa";

function Navbar() {
  // Menggunakan useLocation untuk mendeteksi halaman admin
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');
  
  // Jika berada di halaman admin, navbar tidak perlu fixed
  // Ini akan mencegahnya menutupi konten admin
  const navbarClass = isAdminPage 
    ? "navbar bg-[color:var(--color-base-100)] shadow-sm z-50 h-12" 
    : "navbar bg-[color:var(--color-base-100)] shadow-sm fixed top-0 left-0 right-0 z-50 h-12";

  return (
    <div className={navbarClass}>
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Gunakan flex dengan justify-between untuk memastikan elemen terpisah dengan baik */}
        <div className="w-full flex flex-row items-center justify-between">
          {/* Bagian kiri - Logo dan Beranda dalam satu baris */}
          <div className="flex flex-row items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <FaBook className="text-[color:var(--color-primary)]" />
              <span className="text-gradient font-bold text-lg">UrLibrary</span>
            </Link>
            
            {/* Menu Beranda */}
            <Link to="/" className="hover:text-[color:var(--color-primary)] transition-colors">
              Beranda
            </Link>
          </div>
          
          {/* Bagian kanan - Login Admin button - sembunyikan jika di halaman admin */}
          {!isAdminPage && (
            <Link to="/login" className="btn btn-primary btn-sm h-8 min-h-8 px-4">
              Login Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;