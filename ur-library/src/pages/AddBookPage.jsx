import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ganti impor lama dengan apiService
import { createBook } from '../api/apiService';

// Definisikan kategori secara lokal
const bookCategories = ["Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi"];

function AddBookPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    description: '',
    coverImage: '',
    category: bookCategories[0] // Set nilai default
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBook(formData);
      alert('Buku baru berhasil ditambahkan!');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Gagal menambahkan buku. Pastikan Anda login sebagai admin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tambah Buku Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (field lainnya tidak berubah) ... */}
        <div className="form-control">
          <label className="label"><span className="label-text">Judul Buku</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Masukkan judul buku" className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Penulis</span></label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Masukkan nama penulis" className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Tahun Terbit</span></label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Contoh: 2024" className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Deskripsi</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Masukkan deskripsi singkat buku" required></textarea>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">URL Gambar Sampul</span></label>
          <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Kategori</span></label>
          <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
            {bookCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}

export default AddBookPage;
