import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaSignInAlt, FaBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  // Jadikan fungsi ini async untuk menggunakan await
  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Gunakan await untuk menunggu hasil dari fungsi login
    const success = await login({ email, password });
    
    if (success) {
      alert('Login berhasil!');
      // Navigasi sudah dihandle di dalam fungsi login context
    } else {
      setError('Login gagal! Periksa kembali email atau password Anda.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[color:var(--color-base-100)] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
            <FaBook className="text-[color:var(--color-primary)] text-5xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Login Pengguna</h1>
            <p className="text-gray-600">Masuk untuk melihat koleksi favorit Anda.</p>
        </div>
        
        {error && (
            <div className="alert alert-error mb-6">
                <span>{error}</span>
            </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Email</span></label>
            <input type="email" placeholder="Masukkan email Anda" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Password</span></label>
            <input type="password" placeholder="Masukkan password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="form-control mt-8">
            <button type="submit" className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {!isLoading ? 'Login' : 'Loading...'}
            </button>
          </div>
        </form>
         <p className="text-center mt-4">
            Belum punya akun? <Link to="/register" className="link link-primary">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}

export default UserLoginPage;
