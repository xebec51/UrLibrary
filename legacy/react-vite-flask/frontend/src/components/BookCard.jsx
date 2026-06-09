// mengimpor komponen link untuk navigasi antar halaman
import { Link } from "react-router-dom";
// mengimpor ikon untuk user dan arrow dari react-icons
import { FaUser, FaArrowRight } from "react-icons/fa";
// mengimpor url backend untuk menangani gambar
import { BACKEND_URL } from "../api/apiService"; 

// komponen untuk menampilkan kartu buku dengan informasi dasar
function BookCard({ id, title, author, coverImage }) {

  // menentukan url gambar, jika sudah berupa url lengkap gunakan langsung, jika tidak gabungkan dengan backend url
  const imageUrl = coverImage && coverImage.startsWith('http') 
    ? coverImage 
    : `${BACKEND_URL}${coverImage}`;

  return (
    // container utama kartu dengan efek hover dan shadow
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* bagian gambar dengan efek hover */}
      <figure className="relative h-64 overflow-hidden group">
        {/* gambar sampul buku dengan efek zoom saat hover */}
        <img 
          src={imageUrl} 
          alt={`Sampul buku ${title}`} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
        />
        {/* overlay dengan tombol detail yang muncul saat hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link to={`/books/${id}`} className="btn btn-primary btn-sm w-full group">
            <span>Lihat Detail</span>
            {/* ikon arrow dengan efek gerak saat hover */}
            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </figure>
      {/* bagian konten kartu dengan judul dan penulis */}
      <div className="card-body p-4 flex-grow">
        {/* judul buku yang bisa diklik dengan efek hover */}
        <h2 className="card-title text-lg font-bold line-clamp-2 leading-tight">
          {/* membuat judul juga bisa diklik */}
          <Link to={`/books/${id}`} className="hover:text-primary transition-colors">{title}</Link>
        </h2>
        {/* informasi penulis dengan ikon user */}
        <div className="flex items-center mt-2 text-sm text-base-content/70">
          <FaUser className="mr-2" />
          <span>{author}</span>
        </div>
      </div>
    </div>
  );
}

export default BookCard;