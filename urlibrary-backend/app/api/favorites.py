from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Book, db

# Membuat blueprint baru khusus untuk favorit
favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    """Endpoint untuk mengambil semua buku favorit dari pengguna yang sedang login."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan."}), 404

    # Ambil semua buku dari relasi 'favorite_books'
    favorite_books = user.favorite_books
    
    output = []
    for book in favorite_books:
        book_data = {
            'id': book.id, 'title': book.title, 'author': book.author, 'year': book.year,
            'description': book.description, 'coverImage': book.coverImage, 'category': book.category
        }
        output.append(book_data)

    return jsonify({'books': output})

@favorites_bp.route('/books/<int:book_id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite(book_id):
    """Endpoint untuk menambah/menghapus buku dari daftar favorit."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    book = Book.query.get_or_404(book_id)

    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan"}), 404

    # Cek apakah buku sudah ada di favorit
    if book in user.favorite_books:
        user.favorite_books.remove(book)
        db.session.commit()
        return jsonify({"message": f"'{book.title}' telah dihapus dari favorit Anda."})
    else:
        user.favorite_books.append(book)
        db.session.commit()
        return jsonify({"message": f"'{book.title}' telah ditambahkan ke favorit Anda."})