from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .extensions import db, bcrypt, jwt, migrate
from .models import User, Book
from .api.auth import auth_bp
from .api.books import books_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inisialisasi Ekstensi
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(books_bp, url_prefix='/api')

    # Definisikan semua rute/endpoint di sini
    @app.route("/api/test", methods=['GET'])
    def test_endpoint():
        return jsonify({"message": "Server Flask dengan struktur paket berjalan!"})

    # (Endpoint API lainnya akan ditambahkan di sini nanti)

    return app