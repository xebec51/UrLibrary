import { Link, useLocation } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  // --- PERUBAHAN DI SINI ---
  const { user, logout } = useAuth(); // Ganti 'currentUser' menjadi 'user'

  const handleLogout = () => {
    logout();
    alert('Anda telah berhasil logout.');
  };

  const isAdminPage = location.pathname.includes('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/login-user' || location.pathname === '/register';
  
  const navbarClass = isAdminPage 
    ? "navbar bg-[color:var(--color-base-100)] shadow-sm z-50 h-12" 
    : "navbar bg-[color:var(--color-base-100)] shadow-sm fixed top-0 left-0 right-0 z-50 h-12";

  return (
    <div className={navbarClass}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <FaBook />
              <span>UrLibrary</span>
            </Link>
            <Link to="/" className="hidden md:block hover:text-[color:var(--color-primary)] transition-colors">
              Beranda
            </Link>
            
            {/* --- PERUBAHAN DI SINI --- */}
            {user && (
              <Link to="/my-favorites" className="hidden md:block hover:text-[color:var(--color-primary)] transition-colors">
                Favorit Saya
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* --- PERUBAHAN DI SINI --- */}
            {user ? (
              <>
                {/* --- DAN DI SINI --- */}
                {user.is_admin && (
                  <Link to="/admin/dashboard" className="btn btn-ghost btn-sm h-8 min-h-8 px-4">
                    Admin Dashboard
                  </Link>
                )}
                <span className="font-medium text-sm hidden sm:block">Halo, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm h-8 min-h-8 px-4">
                  Logout
                </button>
              </>
            ) : (
              !isAdminPage && !isAuthPage && (
                <>
                  <Link to="/login-user" className="btn btn-ghost btn-sm h-8 min-h-8 px-4">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm h-8 min-h-8 px-4">
                    Register
                  </Link>
                </>
              )
            )}
            
            {/* --- DAN DI SINI --- */}
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