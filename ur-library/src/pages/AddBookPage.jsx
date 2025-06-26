import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../api/apiService';
import { useAuth } from '../context/AuthContext'; // 1. Impor useAuth
import { FaPlusCircle, FaBook, FaUser, FaCalendarAlt, FaAlignLeft, FaImage, FaTags, FaLink, FaUpload } from 'react-icons/fa';

const bookCategories = ["Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi", "Teknologi", "Sains"];

function AddBookPage() {
    const navigate = useNavigate();
    // 2. Ambil token dari context AuthProvider
    const { token } = useAuth(); 
    const [formData, setFormData] = useState({
        title: '', author: '', year: '', description: '', category: bookCategories[0]
    });
    
    const [uploadMethod, setUploadMethod] = useState('url');
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setCoverImageUrl(url);
        setPreview(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 3. Pengecekan penting: pastikan ada token sebelum melanjutkan
        if (!token) {
            alert("Sesi Anda telah berakhir. Silakan login kembali sebagai admin.");
            navigate('/login');
            return;
        }

        setLoading(true);
        const dataToSend = new FormData();
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }

        if (uploadMethod === 'file' && coverImageFile) {
            dataToSend.append('coverImageFile', coverImageFile);
        } else if (uploadMethod === 'url' && coverImageUrl) {
            dataToSend.append('coverImageUrl', coverImageUrl);
        } else {
            alert('Gambar sampul wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            // 4. Panggil createBook dengan data DAN token
            await createBook(dataToSend, token); 
            alert('Buku baru berhasil ditambahkan!');
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Gagal menambahkan buku.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <FaPlusCircle className="text-4xl text-primary" />
                <h1 className="text-3xl font-bold">Tambah Buku Baru</h1>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            
                            {/* Kolom Kiri */}
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaBook /> Judul Buku</span></label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Laskar Pelangi" className="input input-bordered w-full" required />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaUser /> Penulis</span></label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Contoh: Andrea Hirata" className="input input-bordered w-full" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text flex items-center gap-2"><FaCalendarAlt /> Tahun</span></label>
                                        <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Contoh: 2005" className="input input-bordered w-full" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text flex items-center gap-2"><FaTags /> Kategori</span></label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
                                            {bookCategories.map(category => (<option key={category} value={category}>{category}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan */}
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaImage /> Sumber Gambar Sampul</span></label>
                                    <div className="join w-full">
                                        <button type="button" className={`btn join-item flex-1 ${uploadMethod === 'url' ? 'btn-primary' : ''}`} onClick={() => setUploadMethod('url')}><FaLink className="mr-2"/> URL</button>
                                        <button type="button" className={`btn join-item flex-1 ${uploadMethod === 'file' ? 'btn-primary' : ''}`} onClick={() => setUploadMethod('file')}><FaUpload className="mr-2"/> Unggah</button>
                                    </div>
                                </div>
                                
                                {uploadMethod === 'url' ? (
                                    <input type="url" name="coverImageUrl" value={coverImageUrl} onChange={handleUrlChange} placeholder="https://example.com/image.jpg" className="input input-bordered w-full" />
                                ) : (
                                    <input type="file" name="coverImageFile" onChange={handleFileChange} className="file-input file-input-bordered file-input-primary w-full" accept="image/*" />
                                )}

                                <div className="form-control mt-2">
                                    <label className="label"><span className="label-text">Pratinjau Sampul</span></label>
                                    <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center">
                                        {preview ? (<img src={preview} alt="Pratinjau" className="object-contain h-full w-full rounded-lg" />) : (<span className="text-base-content/50">Gambar akan muncul di sini</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="form-control">
                            <label className="label"><span className="label-text flex items-center gap-2"><FaAlignLeft /> Deskripsi</span></label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Masukkan deskripsi singkat buku" rows="4" required></textarea>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex gap-4 pt-4 border-t border-base-200">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Simpan Buku'}
                            </button>
                            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-ghost">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddBookPage;