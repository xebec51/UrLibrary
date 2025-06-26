import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserEdit, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

function ProfilePage() {
  // --- PERBAIKAN DI SINI: Tambahkan 'updateUser' ---
  const { user, authLoading, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }

    try {
      // Sekarang 'updateUser' sudah dikenali karena diambil dari context
      await updateUser(dataToUpdate); 
      setMessage('Profil berhasil diperbarui!');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setMessage('Gagal memperbarui profil. Coba lagi.');
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="text-center p-12">Memuat...</div>;
  }

  // Sisa kode JSX tidak perlu diubah
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <FaUserEdit className="text-4xl text-primary" />
        <h1 className="text-3xl font-bold">Edit Profil</h1>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('Gagal') ? 'alert-error' : 'alert-success'} mb-4`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2"><FaUser /> Nama Lengkap</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2"><FaEnvelope /> Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2"><FaLock /> Password Baru (Opsional)</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Isi untuk mengganti password"
                className="input input-bordered"
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;