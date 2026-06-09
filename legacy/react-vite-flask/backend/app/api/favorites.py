from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Book, db

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    """Mengambil semua buku yang difavoritkan oleh pengguna yang sedang login."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan."}), 404

    favorite_books_list = [book.to_dict() for book in user.favorite_books]
    
    return jsonify(favorite_books_list), 200

@favorites_bp.route('/books/<int:book_id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite(book_id):
    """Menambah/menghapus buku dari daftar favorit."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    book = Book.query.get_or_404(book_id)

    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan"}), 404

    if book in user.favorite_books:
        user.favorite_books.remove(book)
        action = 'dihapus dari'
    else:
        user.favorite_books.append(book)
        action = 'ditambahkan ke'
        
    db.session.commit()
    return jsonify({'message': f'Buku "{book.title}" berhasil {action} favorit.'}), 200