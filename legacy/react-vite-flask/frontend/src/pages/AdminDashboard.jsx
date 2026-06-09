// mengimpor komponen navigasi dan hook navigate
import { Link, useNavigate } from "react-router-dom"; // Impor useNavigate
// mengimpor hooks react untuk state dan effect
import { useState, useEffect } from "react";
// mengimpor fungsi api untuk manajemen buku dan url backend
import { getAllBooks, deleteBook, BACKEND_URL } from "../api/apiService"; // 1. Impor BACKEND_URL
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from "../context/AuthContext"; // 2. Impor useAuth untuk logout
// mengimpor komponen pagination untuk navigasi halaman
import Pagination from "../components/Pagination.jsx";

// konstanta jumlah item per halaman
const ITEMS_PER_PAGE = 5;

// komponen halaman dashboard admin untuk manajemen buku
function AdminDashboard() {
  // state untuk menyimpan daftar buku
  const [books, setBooks] = useState([]);
  // state untuk halaman yang sedang aktif
  const [currentPage, setCurrentPage] = useState(1);
  // state untuk status loading data
  const [loading, setLoading] = useState(true);
  // state untuk error message
  const [error, setError] = useState(null);
  
  // mengambil fungsi logout dari context dan hook navigate
  const { logout } = useAuth();
  const navigate = useNavigate();

  // fungsi untuk menangani logout admin
  const handleLogout = () => {
    logout();
    alert('Anda telah logout.');
    navigate('/'); // arahkan ke beranda setelah logout
  };

  // fungsi untuk mengambil data semua buku dari server
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

  // effect untuk mengambil data buku saat komponen dimuat
  useEffect(() => {
    fetchBooks();
  }, []);

  // fungsi untuk menangani penghapusan buku
  const handleDeleteBook = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteBook(id);
        alert("Buku berhasil dihapus.");
        // refresh data setelah penghapusan
        fetchBooks();
      } catch (err) {
        alert("Gagal menghapus buku.");
        console.error(err);
      }
    }
  };

  // kalkulasi untuk pagination
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // tampilan loading
  if (loading) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
  }
  
  // tampilan error
  if (error) {
      return <div className="text-center p-12 text-red-500">{error}</div>;
  }
  return (
    // container utama dashboard dengan padding responsif
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* header dashboard dengan judul dan tombol aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <div className="flex gap-3">
          {/* tombol untuk menambah buku baru */}
          <Link to="/admin/add-book" className="btn btn-primary">
            Tambah Buku Baru
          </Link>
          {/* tombol logout dengan fungsi handleLogout */}
          <button onClick={handleLogout} className="btn btn-outline btn-error">
            Logout
          </button>
        </div>
      </div>
      
      {/* tabel daftar buku dengan scroll horizontal untuk responsivitas */}
      <div className="overflow-x-auto bg-base-100 shadow-md rounded-lg">
        <table className="table w-full">
          {/* header tabel */}
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
            {/* mapping data buku untuk setiap baris tabel */}
            {currentBooks.map((book, index) => {
              // logika untuk membuat url gambar yang benar
              const imageUrl = book.coverImage && book.coverImage.startsWith('http')
                ? book.coverImage
                : `${BACKEND_URL}${book.coverImage}`;
              
              return (
                // baris tabel dengan styling zebra stripe
                <tr key={book.id} className={index % 2 === 1 ? "bg-base-200" : ""}>
                  {/* nomor urut */}
                  <td>{startIndex + index + 1}</td>
                  {/* kolom cover buku */}
                  <td>
                    <div className="w-16 h-20 overflow-hidden rounded-md">
                      <img 
                        // menggunakan imageurl yang sudah diperbaiki
                        src={imageUrl} 
                        alt={`Cover ${book.title}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  {/* kolom judul dan penulis */}
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  {/* kolom tombol aksi edit dan hapus */}
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

      {/* komponen pagination untuk navigasi halaman */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AdminDashboard;