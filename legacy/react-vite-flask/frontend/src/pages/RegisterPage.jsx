import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth(); // Ambil juga state loading
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Jadikan fungsi ini async untuk menggunakan await
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    
    // Gunakan await untuk menunggu hasil dari fungsi register
    const success = await register({ name: formData.name, email: formData.email, password: formData.password });

    if (success) {
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login-user');
    } else {
      setError('Registrasi gagal. Email mungkin sudah terdaftar.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[color:var(--color-base-100)] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <FaBook className="text-[color:var(--color-primary)] text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-gray-600">Gabung dengan UrLibrary dan simpan buku favoritmu.</p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Nama Lengkap</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama Anda" className="input input-bordered w-full" required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan email Anda" className="input input-bordered w-full" required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Buat password" className="input input-bordered w-full" required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Konfirmasi Password</span></label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Ulangi password" className="input input-bordered w-full" required />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                {!loading ? 'Daftar' : 'Mendaftar...'}
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Sudah punya akun? <Link to="/login-user" className="link link-primary">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
