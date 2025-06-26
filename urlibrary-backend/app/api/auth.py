from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, db
from ..extensions import bcrypt

auth_bp = Blueprint('auth', __name__)

# --- FUNGSI REGISTER (Tidak ada perubahan) ---
@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Data tidak lengkap."}), 400
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email sudah terdaftar."}), 409
    new_user = User(name=data.get('name'), email=data.get('email'))
    new_user.password = data.get('password')
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"Pengguna '{new_user.name}' berhasil terdaftar."}), 201

# --- FUNGSI LOGIN (PERBAIKAN UTAMA) ---
@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email dan password harus diisi."}), 400

    user = User.query.filter_by(email=data.get('email')).first()
    if not user or not user.check_password(data.get('password')):
        return jsonify({"error": "Email atau password salah."}), 401

    # --- PERBAIKAN KRUSIAL DI SINI ---
    # Ubah user.id (integer) menjadi string sebelum membuat token
    access_token = create_access_token(identity=str(user.id))
    
    # Siapkan data pengguna untuk dikirim ke frontend
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "favorites": [book.id for book in user.favorite_books]
    }
    
    # Kembalikan token DAN data pengguna dalam satu respons
    return jsonify({
        "access_token": access_token,
        "user": user_data
    }), 200

# --- FUNGSI GET PROFILE (Sudah Benar) ---
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id) # SQLAlchemy bisa handle 'id' dalam bentuk string
    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan"}), 404
    favorite_ids = [book.id for book in user.favorite_books]
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "favorites": favorite_ids
    }
    return jsonify(user_data), 200

# --- FUNGSI UPDATE PROFILE (Sudah Benar) ---
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    data = request.get_json()
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    if 'password' in data and data['password']:
        user.password = data['password']
    db.session.commit()
    # Kembalikan juga data favorit agar state di frontend tetap konsisten
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "favorites": [book.id for book in user.favorite_books]
    }
    return jsonify(user_data), 200