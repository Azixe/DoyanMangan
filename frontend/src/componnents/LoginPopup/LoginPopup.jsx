import React, { useContext, useState } from 'react'; // Mengimpor React dan hook useContext, useState.
import './LoginPopup.css'; // Mengimpor file CSS untuk styling.
import { assets } from '../../assets/assets'; // Mengimpor aset (gambar, ikon, dll.).
import { StoreContext } from '../../context/StoreContext'; // Mengimpor konteks global aplikasi.
import axios from "axios"; // Mengimpor axios untuk permintaan HTTP.
import { useNavigate } from 'react-router-dom'; // Mengimpor useNavigate untuk navigasi antar halaman.

// Komponen LoginPopup untuk menangani login atau pendaftaran.
const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext); // Mengambil data global dari konteks StoreContext.
    const navigate = useNavigate(); // Hook untuk navigasi antar halaman.

    // State untuk menentukan apakah pengguna sedang login atau membuat akun baru.
    const [currState, setCurrState] = useState("Login");

    // State untuk menyimpan data input pengguna (nama, email, password).
    const [data, setData] = useState({
        name: "", // Nama pengguna (hanya diperlukan untuk pendaftaran).
        email: "", // Email pengguna.
        password: "" // Password pengguna.
    });

    // Fungsi untuk menangani perubahan input.
    const onChangeHandler = (event) => {
        const name = event.target.name; // Nama input (name, email, atau password).
        const value = event.target.value; // Nilai input.
        setData(data => ({ ...data, [name]: value })); // Memperbarui state data.
    };

    // Fungsi untuk menangani login atau pendaftaran.
    const onLogin = async (event) => {
        event.preventDefault(); // Mencegah halaman melakukan reload.
        let newUrl = url; // Base URL API.
        if (currState === "Login") {
            newUrl += "/api/user/login"; // Endpoint untuk login.
        } else {
            newUrl += "/api/user/register"; // Endpoint untuk pendaftaran.
        }

        // Mengirim permintaan POST ke server dengan data input pengguna.
        const response = await axios.post(newUrl, data);

        if (response.data.success) { // Jika permintaan berhasil.
            setToken(response.data.token); // Menyimpan token autentikasi di konteks global.
            localStorage.setItem("token", response.data.token); // Menyimpan token di localStorage.
            setShowLogin(false); // Menutup popup login.
        } else {
            alert(response.data.message); // Menampilkan pesan kesalahan jika gagal.
        }
    };

    // Fungsi untuk menangani klik "Lupa Password".
    const handleForgotPassword = () => {
        setShowLogin(false); // Menutup popup sebelum navigasi.
        navigate('/reset-password'); // Navigasi ke halaman reset password.
    };

    // Struktur tampilan popup.
    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                {/* Header Popup */}
                <div className="login-popup-title">
                    <h2>{currState}</h2> {/* Menampilkan "Login" atau "Sign Up". */}
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" /> {/* Tombol untuk menutup popup. */}
                </div>

                {/* Input untuk nama, email, dan password */}
                <div className="login-popup-inputs">
                    {currState === "Login" ? null : (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder='Your name'
                            required
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type='email'
                        placeholder='Your email'
                        required
                    />
                    <input
                        name="password"
                        onChange={onChangeHandler}
                        value={data.password}
                        type='password'
                        placeholder='Password'
                        required
                    />
                </div>

                {/* Tombol untuk login atau membuat akun */}
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>

                {/* Link untuk lupa password (hanya ditampilkan saat login) */}
                {currState === "Login" && (
                    <p className="forgot-password" onClick={handleForgotPassword}>
                        Lupa Password?
                    </p>
                )}

                {/* Checkbox untuk menyetujui syarat dan ketentuan */}
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>

                {/* Link untuk beralih antara login dan pendaftaran */}
                {currState === "Login" ? (
                    <p>
                        Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span>
                    </p>
                ) : (
                    <p>
                        Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup; // Mengekspor komponen LoginPopup agar bisa digunakan di tempat lain.