import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { booksData, deleteBook } from "../api/books.js";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBooks(booksData);
  }, []);

  const handleDelete = (id) => {
    // Tampilkan konfirmasi sebelum menghapus untuk mencegah kesalahan
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      // 1. Hapus buku dari "database"
      deleteBook(id);
      // 2. Perbarui state lokal untuk me-render ulang UI tanpa reload halaman
      setBooks(currentBooks => currentBooks.filter(book => book.id !== id));
      alert("Buku berhasil dihapus.");
    }
  };

  const handleLogout = () => {
    if (window.confirm(" Apakah Anda yakin ingin logout?")) {
        navigate('/login');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/admin/add" className="btn btn-primary">
            Tambah Buku Baru
          </Link>
          <button onClick={handleLogout} className="btn btn-outline btn-error">
            Logout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          {/* Kepala Tabel */}
          <thead>
            <tr>
              <th>No</th>
              <th>Cover</th>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Aksi</th>
            </tr>
          </thead>
          {/* Badan Tabel */}
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <th>{index + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="w-16 rounded">
                      <img src={book.coverImage} alt={`Cover ${book.title}`} />
                    </div>
                  </div>
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td className="flex gap-2">
                  <Link to={`/admin/edit/${book.id}`} className="btn btn-warning btn-sm">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(book.id)} className="btn btn-error btn-sm">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;