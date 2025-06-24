import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // State untuk menampung nilai dari input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hook untuk navigasi/redirect
  const navigate = useNavigate();

  // Fungsi yang akan dijalankan saat tombol login di-klik
  const handleLogin = (event) => {
    // Mencegah browser me-reload halaman saat form disubmit
    event.preventDefault();

    // --- SIMULASI LOGIN ---
    // Di aplikasi nyata, bagian ini akan mengirim data ke backend.
    // Untuk sekarang, kita cek manual.
    if (email === 'admin@urlibrary.com' && password === 'admin123') {
      alert('Login berhasil!');
      // Arahkan ke dashboard admin jika berhasil
      navigate('/admin/dashboard');
    } else {
      alert('Login gagal! Email atau password salah.');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login Admin</h1>
          <p className="py-6">Silakan masuk untuk mengelola katalog buku UrLibrary.</p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          {/* Form login */}
          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="email" 
                className="input input-bordered"
                value={email} // Hubungkan dengan state email
                onChange={(e) => setEmail(e.target.value)} // Update state saat diketik
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="password" 
                className="input input-bordered"
                value={password} // Hubungkan dengan state password
                onChange={(e) => setPassword(e.target.value)} // Update state saat diketik
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;