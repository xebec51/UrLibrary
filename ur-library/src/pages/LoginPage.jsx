import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaSignInAlt, FaBook } from 'react-icons/fa';
// Impor hook useAuth untuk menggunakan fungsi login yang sesungguhnya
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  // Kita bisa pre-fill email dan password admin untuk memudahkan testing
  const [email, setEmail] = useState('admin@urlibrary.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  // Ambil fungsi login dari AuthContext
  const { login } = useAuth();

  // Jadikan fungsi handleLogin async
  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Panggil fungsi login yang sesungguhnya dari context
    const success = await login({ email, password });

    if (success) {
      alert('Login Admin berhasil!');
      // Arahkan ke dashboard admin jika berhasil
      navigate('/admin/dashboard');
    } else {
      setError('Login gagal! Periksa kembali kredensial admin Anda.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full bg-[color:var(--color-base-100)] rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section - Login Form */}
          <div className="p-8 md:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Login Admin</h1>
                <p className="text-gray-600">
                  Silakan masuk untuk mengelola katalog buku UrLibrary.
                </p>
              </div>
              
              {error && (
                <div className="alert alert-error mb-6 shadow-lg">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Admin</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Masukkan email admin" 
                      className="input input-bordered w-full pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="Masukkan password" 
                      className="input input-bordered w-full pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-control mt-8">
                  <button 
                    type="submit" 
                    className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {!isLoading ? (
                      <>
                        <FaSignInAlt />
                        <span>Login</span>
                      </>
                    ) : "Loading..."}
                  </button>
                </div>
              </form>

              <div className="text-center mt-8">
                <Link to="/" className="text-[color:var(--color-primary)] hover:underline">
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hidden md:block bg-[color:var(--color-primary)]/10">
            <div className="h-full w-full flex items-center justify-center p-12">
              <div className="text-center p-8 bg-[color:var(--color-base-100)]/80 backdrop-blur-sm rounded-xl shadow-lg">
                <FaBook className="text-[color:var(--color-primary)] text-6xl mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">UrLibrary Admin</h2>
                <p className="text-gray-600">
                  Platform pengelolaan katalog buku digital untuk memudahkan akses terhadap literatur berkualitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;