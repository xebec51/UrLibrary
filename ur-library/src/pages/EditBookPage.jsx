import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Ganti impor lama dengan apiService
import { getBookById, updateBook } from '../api/apiService';

// Definisikan kategori secara lokal karena file lama sudah dihapus
const bookCategories = ["Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi"];

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', author: '', year: '', description: '', coverImage: '', category: ''
  });

  useEffect(() => {
    // Fungsi async untuk mengambil data buku dari server
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setFormData(bookData);
      } catch (error) {
        alert('Gagal memuat data buku.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Jadikan fungsi submit async untuk memanggil API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(id, formData);
      alert('Buku berhasil diperbarui!');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Gagal memperbarui buku. Pastikan Anda login sebagai admin.');
      console.error(error);
    }
  };
  
  if (loading) return <div className="p-8 text-center">Memuat data buku...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Buku</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label"><span className="label-text">Judul Buku</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Penulis</span></label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Tahun Terbit</span></label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} className="input input-bordered w-full" required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Deskripsi</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" required></textarea>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">URL Gambar Sampul</span></label>
          <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} className="input input-bordered w-full" required />
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
          <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}

export default EditBookPage;
