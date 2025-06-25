from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token,  jwt_required, get_jwt_identity
from ..models import User, db
from ..extensions import bcrypt

# Cukup definisikan blueprint satu kali
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    """Endpoint untuk registrasi pengguna baru."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Data tidak lengkap. Pastikan email, password, dan nama diisi."}), 400

    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email sudah terdaftar."}), 409

    new_user = User(
        name=data.get('name'),
        email=data.get('email')
    )
    new_user.password = data.get('password')

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": f"Pengguna '{new_user.name}' berhasil terdaftar."}), 201


@auth_bp.route('/login', methods=['POST'])
def login_user():
    """Endpoint untuk login pengguna dan mendapatkan token JWT."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email dan password harus diisi."}), 400

    user = User.query.filter_by(email=data.get('email')).first()

    if not user or not user.check_password(data.get('password')):
        return jsonify({"error": "Email atau password salah."}), 401

    # Perbaikan: Pastikan identity adalah string untuk menghindari error
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify(access_token=access_token), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Endpoint untuk mengambil data profil pengguna yang sedang login."""
    current_user_id = get_jwt_identity() # Ini adalah string 'id' dari user
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan"}), 404
    
    # Ambil semua ID buku dari daftar favorit pengguna
    favorite_ids = [book.id for book in user.favorite_books]
    
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "favorites": favorite_ids # Sertakan daftar favorit
    }
    return jsonify(user_data), 200