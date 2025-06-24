import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, updateBook } from '../api/books';

function EditBookPage() {
  const { id } = useParams(); // Dapatkan ID dari URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    description: '',
    coverImage: ''
  });

  // useEffect untuk memuat data buku saat halaman pertama kali dibuka
  useEffect(() => {
    const bookToEdit = getBookById(id);
    if (bookToEdit) {
      setFormData(bookToEdit); // Isi form dengan data yang ada
    }
  }, [id]); // Jalankan efek ini jika id berubah

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBook(id, formData); // Panggil fungsi update
    alert('Buku berhasil diperbarui!');
    navigate('/admin/dashboard'); // Kembali ke dashboard
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Buku</h1>
      {/* Form ini sama persis dengan form Tambah Buku */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input untuk Judul */}
        <div className="form-control">
          <label className="label"><span className="label-text">Judul Buku</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        {/* Input untuk Penulis */}
        <div className="form-control">
          <label className="label"><span className="label-text">Penulis</span></label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        {/* Input untuk Tahun Terbit */}
        <div className="form-control">
          <label className="label"><span className="label-text">Tahun Terbit</span></label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        {/* Input untuk Deskripsi */}
        <div className="form-control">
          <label className="label"><span className="label-text">Deskripsi</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" required></textarea>
        </div>
        
        {/* Input untuk URL Gambar Sampul */}
        <div className="form-control">
          <label className="label"><span className="label-text">URL Gambar Sampul</span></label>
          <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} className="input input-bordered w-full" required />
        </div>
        
        {/* Tombol Aksi */}
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}

export default EditBookPage;