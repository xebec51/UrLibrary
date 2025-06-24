import { Link } from "react-router-dom";
import { FaUser, FaArrowRight } from "react-icons/fa";

function BookCard({ id, title, author, coverImage }) {
  return (
    <div className="card bg-[color:var(--color-base-100)] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <figure className="relative h-64 overflow-hidden group">
        <img 
          src={coverImage} 
          alt={`Sampul buku ${title}`} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <Link to={`/books/${id}`} className="btn btn-primary btn-sm w-full group">
              <span>Lihat Detail</span>
              <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold line-clamp-2 hover:text-[color:var(--color-primary)]">{title}</h2>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <FaUser className="mr-2" />
          <span>{author}</span>
        </div>
      </div>
    </div>
  );
}

export default BookCard;