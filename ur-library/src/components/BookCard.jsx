import { Link } from "react-router-dom";

function BookCard({ id, title, author, coverImage }) {
  return (
    <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="h-80">
        <img src={coverImage} alt={`Sampul buku ${title}`} className="object-cover w-full h-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>Penulis: {author}</p>
        <div className="card-actions justify-end">
          {/* Link ini akan mengarah ke halaman detail buku */}
          <Link to={`/books/${id}`} className="btn btn-primary">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;