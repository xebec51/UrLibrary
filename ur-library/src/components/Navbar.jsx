import { Link, useLocation } from "react-router-dom";
import { FaBook, FaUserCircle } from "react-icons/fa"; // Pastikan FaUserCircle diimpor
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert('Anda telah berhasil logout.');
  };

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/login-user' || location.pathname === '/register';
  
  const navbarClass = isAdminPage 
    ? "navbar bg-base-100 shadow-sm z-50 h-12" 
    : "navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50 h-12";

  return (
    <div className={navbarClass}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="w-full flex flex-row items-center justify-between">
          {/* Bagian Kiri Navbar */}
          <div className="flex flex-row items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <FaBook />
              <span>UrLibrary</span>
            </Link>
            <Link to="/" className="hidden md:block hover:text-primary transition-colors">
              Beranda
            </Link>
            {user && (
              <Link to="/my-favorites" className="hidden md:block hover:text-primary transition-colors">
                Favorit Saya
              </Link>
            )}
          </div>
          
          {/* Bagian Kanan Navbar */}
          <div className="flex items-center gap-3">
            {user ? (
              // --- TAMPILAN SETELAH LOGIN ---
              <>
                {user.is_admin && (
                  <Link to="/admin/dashboard" className="btn btn-ghost btn-sm h-8 min-h-8 px-4">
                    Admin Dashboard
                  </Link>
                )}
                
                {/* --- MENU DROPDOWN PROFIL --- */}
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full flex items-center justify-center">
                       <FaUserCircle size={28} className="text-gray-500" />
                    </div>
                  </label>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li className="px-4 py-2 font-bold text-base-content/60">{user.name}</li>
                    <div className="divider my-0"></div>
                    <li><Link to="/profile">Edit Profil</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </>
            ) : (
              // --- TAMPILAN SEBELUM LOGIN ---
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