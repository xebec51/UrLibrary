import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, updateBook, bookCategories } from '../api/books'; // <- Impor bookCategories

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    description: '',
    coverImage: '',
    category: '' // <- Tambahkan state
  });

  useEffect(() => {
    const bookToEdit = getBookById(id);
    if (bookToEdit) {
      setFormData(bookToEdit);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBook(id, formData);
    alert('Buku berhasil diperbarui!');
    navigate('/admin/dashboard');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Buku</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... field lainnya tetap sama ... */}
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

        {/* Input untuk Kategori */}
        <div className="form-control">
          <label className="label"><span className="label-text">Kategori</span></label>
          <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
             {bookCategories.filter(c => c !== 'Semua').map(category => (
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