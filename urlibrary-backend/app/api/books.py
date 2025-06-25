from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Book, User

books_bp = Blueprint('books', __name__)

# --- READ ALL (Sudah ada, tidak perlu diubah) ---
@books_bp.route('/books', methods=['GET'])
@jwt_required()
def get_all_books():
    """Endpoint untuk mengambil semua data buku."""
    books = Book.query.all()
    output = []
    for book in books:
        book_data = {
            'id': book.id, 'title': book.title, 'author': book.author, 'year': book.year,
            'description': book.description, 'coverImage': book.coverImage, 'category': book.category
        }
        output.append(book_data)
    return jsonify({'books': output})

# --- READ ONE ---
@books_bp.route('/books/<int:book_id>', methods=['GET'])
@jwt_required()
def get_one_book(book_id):
    """Endpoint untuk mengambil detail satu buku."""
    book = Book.query.get_or_404(book_id)
    book_data = {
        'id': book.id, 'title': book.title, 'author': book.author, 'year': book.year,
        'description': book.description, 'coverImage': book.coverImage, 'category': book.category
    }
    return jsonify(book_data)

# --- CREATE (Admin Only) ---
@books_bp.route('/books', methods=['POST'])
@jwt_required()
def create_book():
    """Endpoint untuk membuat buku baru (hanya admin)."""
    # 1. Dapatkan identitas (ID) user dari token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # 2. Cek apakah user adalah admin
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak. Hanya admin yang bisa menambah buku."}), 403 # 403 Forbidden

    # 3. Jika admin, lanjutkan proses
    data = request.get_json()
    new_book = Book(
        title=data['title'], author=data['author'], year=data['year'],
        description=data['description'], coverImage=data['coverImage'], category=data['category']
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Buku baru berhasil dibuat."}), 201

# --- UPDATE (Admin Only) ---
@books_bp.route('/books/<int:book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    """Endpoint untuk memperbarui buku (hanya admin)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak. Hanya admin yang bisa mengubah buku."}), 403

    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.year = data.get('year', book.year)
    book.description = data.get('description', book.description)
    book.coverImage = data.get('coverImage', book.coverImage)
    book.category = data.get('category', book.category)
    
    db.session.commit()
    return jsonify({"message": "Buku berhasil diperbarui."})

# --- DELETE (Admin Only) ---
@books_bp.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    """Endpoint untuk menghapus buku (hanya admin)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak. Hanya admin yang bisa menghapus buku."}), 403

    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Buku berhasil dihapus."})