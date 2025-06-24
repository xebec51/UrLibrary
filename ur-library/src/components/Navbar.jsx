import { Link, useLocation } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // <- Gunakan hook kustom kita

function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useAuth(); // <- Ambil data dari context

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
          {/* ... bagian kiri: logo & beranda ... */}
          <div className="flex flex-row items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <FaBook className="text-[color:var(--color-primary)]" />
              <span className="text-gradient font-bold text-lg">UrLibrary</span>
            </Link>
            
            <Link to="/" className="hover:text-[color:var(--color-primary)] transition-colors">
              Beranda
            </Link>
            
            {currentUser && (
              <Link to="/my-favorites" className="hover:text-[color:var(--color-primary)] transition-colors">
                Favorit Saya
              </Link>
            )}
          </div>
          
          {/* ... bagian kanan: tombol dinamis ... */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="font-medium text-sm hidden sm:block">Halo, {currentUser.name}</span>
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
            
            {!currentUser && !isAdminPage && !isAuthPage && (
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