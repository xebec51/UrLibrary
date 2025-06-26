import { Link, useNavigate } from "react-router-dom"; // Impor useNavigate
import { useState, useEffect } from "react";
import { getAllBooks, deleteBook, BACKEND_URL } from "../api/apiService"; // 1. Impor BACKEND_URL
import { useAuth } from "../context/AuthContext"; // 2. Impor useAuth untuk logout
import Pagination from "../components/Pagination.jsx";

const ITEMS_PER_PAGE = 5;

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. Ambil fungsi logout dan navigate
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('Anda telah logout.');
    navigate('/'); // Arahkan ke beranda setelah logout
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data.books || []);
    } catch (err) {
      setError("Gagal memuat data buku. Pastikan server backend berjalan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteBook(id);
        alert("Buku berhasil dihapus.");
        fetchBooks();
      } catch (err) {
        alert("Gagal menghapus buku.");
        console.error(err);
      }
    }
  };

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  if (loading) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
  }
  
  if (error) {
      return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/add-book" className="btn btn-primary">
            Tambah Buku Baru
          </Link>
          {/* 4. Ganti Link menjadi button dengan fungsi handleLogout */}
          <button onClick={handleLogout} className="btn btn-outline btn-error">
            Logout
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-base-100 shadow-md rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Cover</th>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book, index) => {
              // 5. Logika untuk membuat URL gambar yang benar
              const imageUrl = book.coverImage && book.coverImage.startsWith('http')
                ? book.coverImage
                : `${BACKEND_URL}${book.coverImage}`;
              
              return (
                <tr key={book.id} className={index % 2 === 1 ? "bg-base-200" : ""}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    <div className="w-16 h-20 overflow-hidden rounded-md">
                      <img 
                        // 6. Gunakan imageUrl yang sudah diperbaiki
                        src={imageUrl} 
                        alt={`Cover ${book.title}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/admin/edit-book/${book.id}`} className="btn btn-warning btn-sm">
                        Edit
                      </Link>
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AdminDashboard;