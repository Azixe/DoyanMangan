// Mengimpor React dan hook yang diperlukan
import React, { useContext, useState } from 'react';
import './ResetPassword.css'; // Tambahkan file CSS untuk halaman ini untuk styling
import axios from 'axios'; // Digunakan untuk request HTTP
import { useNavigate } from 'react-router-dom'; // Untuk navigasi antar halaman
import { StoreContext } from '../../context/StoreContext'; // Mengimpor StoreContext untuk akses URL backend

// Komponen ResetPassword untuk menangani fitur reset password
const ResetPassword = () => {
    // State untuk menyimpan email yang diinput pengguna
    const [email, setEmail] = useState('');
    // State untuk mengatur status loading selama request berlangsung
    const [loading, setLoading] = useState(false);
    // State untuk menyimpan pesan yang ditampilkan kepada pengguna
    const [message, setMessage] = useState('');
    // Hook untuk navigasi ke halaman lain
    const navigate = useNavigate();
    // Mengambil URL dari StoreContext
    const { url } = useContext(StoreContext);

    // Fungsi untuk menangani pengiriman form reset password
    const handleResetPassword = async (event) => {
        event.preventDefault(); // Mencegah refresh halaman saat form dikirim
        setLoading(true); // Mengatur status loading menjadi true saat request dimulai

        try {
<<<<<<< HEAD
            // Mengirim request POST ke endpoint reset-password dengan email pengguna
            const response = await axios.post(url + "/api/user/reset-password", { email });

            if (response.data.success) { // Jika respon dari server menunjukkan keberhasilan
                setMessage('A password reset link has been sent to your email!'); // Menampilkan pesan sukses
                // Mengarahkan pengguna ke halaman awal setelah 3 detik
=======
            const response = await axios.post('http://localhost:4000/api/user/reset-password', { email });
            if (response.data.success) {
                setMessage('A password reset link has been sent to your email!');
>>>>>>> 721648e6740643978a63c7084faa4e67a17f8dc4
                setTimeout(() => navigate('/'), 3000);
            } else {
                // Jika respon dari server menunjukkan kegagalan, tampilkan pesan error dari server
                setMessage(response.data.message);
            }
        } catch (error) {
            // Menangani error yang terjadi selama request
            setMessage('An error occurred. Please try again.'); // Pesan error generik
        } finally {
            setLoading(false); // Mengatur status loading menjadi false setelah request selesai
        }
    };

    return (
        // Struktur halaman reset password
        <div className='reset-password'>
            <form onSubmit={handleResetPassword} className="reset-password-container">
                <h2>Reset Password</h2> {/* Judul halaman */}
                <input
                    type="email" // Input untuk email pengguna
                    placeholder="Enter your email" // Placeholder sebagai petunjuk
                    value={email} // Menghubungkan value input dengan state email
                    onChange={(e) => setEmail(e.target.value)} // Mengubah state email saat pengguna mengetik
                    required // Menandakan bahwa input ini wajib diisi
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Email'} {/* Tombol dengan teks yang berubah tergantung status loading */}
                </button>
                {message && <p className="reset-password-message">{message}</p>} {/* Menampilkan pesan jika ada */}
            </form>
        </div>
    );
};

export default ResetPassword;
