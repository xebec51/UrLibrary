import { Link } from "react-router-dom";
import { FaUser, FaArrowRight } from "react-icons/fa";
import { BACKEND_URL } from "../api/apiService"; 

function BookCard({ id, title, author, coverImage }) {

  const imageUrl = coverImage && coverImage.startsWith('http') 
    ? coverImage 
    : `${BACKEND_URL}${coverImage}`;

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <figure className="relative h-64 overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={`Sampul buku ${title}`} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link to={`/books/${id}`} className="btn btn-primary btn-sm w-full group">
            <span>Lihat Detail</span>
            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </figure>
      <div className="card-body p-4 flex-grow">
        <h2 className="card-title text-lg font-bold line-clamp-2 leading-tight">
          {/* Membuat judul juga bisa diklik */}
          <Link to={`/books/${id}`} className="hover:text-primary transition-colors">{title}</Link>
        </h2>
        <div className="flex items-center mt-2 text-sm text-base-content/70">
          <FaUser className="mr-2" />
          <span>{author}</span>
        </div>
      </div>
    </div>
  );
}

export default BookCard;