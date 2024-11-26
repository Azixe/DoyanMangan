import React, { useContext, useState } from 'react'; // Import React, useContext untuk mengakses context, dan useState untuk state lokal.
import './LoginPopup.css'; // Import file CSS untuk styling komponen LoginPopup.
import { assets } from '../../assets/assets'; // Import aset gambar dari folder assets.
import { StoreContext } from '../../context/StoreContext'; // Import StoreContext untuk akses data global.
import axios from "axios"; // Import axios untuk melakukan permintaan HTTP ke API.

const LoginPopup = ({ setShowLogin }) => {
    // Komponen LoginPopup menerima prop `setShowLogin` untuk mengontrol visibilitas popup.

    const { url, setToken } = useContext(StoreContext);
    // Mengambil `url` dan fungsi `setToken` dari context untuk komunikasi dengan server dan menyimpan token login.

    const [currState, setCurrState] = useState("Login");
    // State untuk menentukan mode popup: "Login" atau "Sign Up".

    const [data, setData] = useState({
        name: "", // Input untuk nama pengguna (hanya digunakan untuk Sign Up).
        email: "", // Input untuk email pengguna.
        password: "" // Input untuk password pengguna.
    });

    const onChangeHandler = (event) => {
        // Fungsi untuk menangani perubahan input form.
        const name = event.target.name; // Mendapatkan atribut `name` dari input.
        const value = event.target.value; // Mendapatkan nilai input yang diubah.
        setData(data => ({ ...data, [name]: value }));
        // Mengupdate state `data` dengan nilai baru berdasarkan `name`.
    };

    const onLogin = async (event) => {
        // Fungsi untuk menangani submit form.
        event.preventDefault(); // Mencegah reload halaman default pada form submit.

        let newUrl = url; // Salin `url` dari context.
        if (currState === "Login") {
            // Jika mode saat ini adalah Login, tambahkan endpoint login.
            newUrl += "/api/user/login";
        } else {
            // Jika mode saat ini adalah Sign Up, tambahkan endpoint register.
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);
        // Kirim permintaan POST ke server dengan data form.

        if (response.data.success) {
            // Jika respons dari server menyatakan berhasil.
            setToken(response.data.token);
            // Simpan token login di context global.
            localStorage.setItem("token", response.data.token);
            // Simpan token login di localStorage untuk sesi berikutnya.
            setShowLogin(false); // Tutup popup login setelah berhasil.
        } else {
            alert(response.data.message);
            // Tampilkan pesan error jika login/register gagal.
        }
    };

    return (
        <div className='login-popup'>
            {/* Wrapper utama untuk popup login */}
            <form onSubmit={onLogin} className="login-popup-container">
                {/* Form untuk login atau register */}
                <div className="login-popup-title">
                    {/* Header form yang berisi judul dan ikon close */}
                    <h2>{currState}</h2>
                    {/* Judul form, tergantung mode Login atau Sign Up */}
                    <img
                        onClick={() => setShowLogin(false)}
                        // Tutup popup saat ikon diklik.
                        src={assets.cross_icon}
                        alt="Close popup"
                    />
                </div>
                <div className="login-popup-inputs">
                    {/* Input untuk data pengguna */}
                    {currState === "Login" ? null : (
                        // Jika mode Sign Up, tampilkan input untuk nama pengguna.
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
                <button type='submit'>
                    {/* Tombol submit dengan label sesuai mode */}
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>
                <div className="login-popup-condition">
                    {/* Checkbox untuk menyetujui syarat dan kebijakan */}
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login" ? (
                    // Jika mode Login, tampilkan opsi untuk berpindah ke mode Sign Up.
                    <p>
                        Create a new account?
                        <span onClick={() => setCurrState("Sign Up")}>Click here</span>
                    </p>
                ) : (
                    // Jika mode Sign Up, tampilkan opsi untuk kembali ke mode Login.
                    <p>
                        Already have an account?
                        <span onClick={() => setCurrState("Login")}>Login here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
// Ekspor komponen LoginPopup untuk digunakan di bagian lain aplikasi.
