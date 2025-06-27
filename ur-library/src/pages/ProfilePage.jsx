import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserEdit, FaEnvelope, FaLock, FaUser, FaKey } from 'react-icons/fa';

function ProfilePage() {
  const { user, authLoading, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '', // 1. State baru untuk password lama
    newPassword: '',     // 2. Ganti nama state 'password' menjadi 'newPassword'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
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

    // 3. Siapkan data untuk dikirim ke backend
    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
    };
    
    // Hanya kirim data password jika pengguna ingin mengubahnya
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setMessage('Gagal: Masukkan password lama Anda untuk mengatur password baru.');
        setIsLoading(false);
        return;
      }
      dataToUpdate.current_password = formData.currentPassword;
      dataToUpdate.new_password = formData.newPassword;
    }

    try {
      await updateUser(dataToUpdate); 
      setMessage('Profil berhasil diperbarui!');
      // Kosongkan semua field password setelah berhasil
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      // Menampilkan pesan error dari backend jika ada
      setMessage(`Gagal memperbarui profil: ${error.message}`);
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="text-center p-12">Memuat...</div>;
  }

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
              <label className="label"><span className="label-text flex items-center gap-2"><FaUser /> Nama Lengkap</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text flex items-center gap-2"><FaEnvelope /> Email</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered" required />
            </div>
            
            <div className="divider">Ubah Password (Opsional)</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2"><FaKey /> Password Lama</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Masukkan password Anda saat ini"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2"><FaLock /> Password Baru</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Isi untuk mengganti password lama"
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