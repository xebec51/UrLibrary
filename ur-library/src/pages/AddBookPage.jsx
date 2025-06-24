import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../api/books'; // Import fungsi yang baru kita buat

function AddBookPage() {
  const navigate = useNavigate();
  // Gunakan satu state object untuk menampung semua data form
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    description: '',
    coverImage: ''
  });

  // Fungsi untuk menangani perubahan pada setiap input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Panggil fungsi addBook dengan data dari form
    addBook(formData);
    alert('Buku baru berhasil ditambahkan!');
    // Arahkan kembali ke dashboard
    navigate('/admin/dashboard');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tambah Buku Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input untuk Judul */}
        <div className="form-control">
          <label className="label"><span className="label-text">Judul Buku</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Masukkan judul buku" className="input input-bordered w-full" required />
        </div>

        {/* Input untuk Penulis */}
        <div className="form-control">
          <label className="label"><span className="label-text">Penulis</span></label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Masukkan nama penulis" className="input input-bordered w-full" required />
        </div>

        {/* Input untuk Tahun Terbit */}
        <div className="form-control">
          <label className="label"><span className="label-text">Tahun Terbit</span></label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Contoh: 2024" className="input input-bordered w-full" required />
        </div>

        {/* Input untuk Deskripsi */}
        <div className="form-control">
          <label className="label"><span className="label-text">Deskripsi</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Masukkan deskripsi singkat buku" required></textarea>
        </div>

        {/* Input untuk URL Gambar Sampul */}
        <div className="form-control">
          <label className="label"><span className="label-text">URL Gambar Sampul</span></label>
          <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className="input input-bordered w-full" required />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">Simpan</button>
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}

export default AddBookPage;