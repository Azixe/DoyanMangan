import React, { useContext, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./UpdatePassword.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const UpdatePassword = () => {
  // State untuk menyimpan password baru dan konfirmasi password.
  const [password, setPassword] = useState(""); // Untuk menyimpan password baru.
  const [confirmPassword, setConfirmPassword] = useState(""); // Untuk menyimpan konfirmasi password.
  const [message, setMessage] = useState(""); // Menyimpan pesan untuk pengguna (error/sukses).

  // Mendapatkan token reset password dari URL.
  const [searchParams] = useSearchParams(); // Hook untuk membaca query parameter dari URL.
  const token = searchParams.get("token"); // Mengambil nilai token dari query parameter.

  // Hook navigasi untuk berpindah halaman setelah operasi selesai.
  const navigate = useNavigate();

  // Mengambil URL dari StoreContext (untuk endpoint API).
  const { url } = useContext(StoreContext);

  // Fungsi untuk validasi kecocokan antara password dan konfirmasi password.
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setMessage("Passwords don't match"); // Menampilkan pesan jika password tidak cocok.
      return false;
    }
    setMessage(""); // Menghapus pesan error jika password cocok.
    return true;
  };

  // Fungsi untuk menangani submit form.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman saat form disubmit.

    // Memvalidasi password sebelum melanjutkan proses.
    if (!validatePassword()) return;

    try {
      // Mengirimkan request ke API untuk memperbarui password.
      const response = await axios.post(url + "/api/user/update-password", { token, password });

      // Jika password berhasil diperbarui, menampilkan pesan sukses dan mengarahkan pengguna.
      if (response.data.success) {
        setMessage("Password updated successfully!");
        setTimeout(() => navigate("/"), 2000); // Navigasi ke halaman utama setelah 2 detik.
      } else {
        setMessage(response.data.message); // Menampilkan pesan error dari server jika gagal.
      }
    } catch (error) {
      setMessage("Error updating password. Please try again."); // Menampilkan pesan error jika terjadi masalah.
    }
  };

  return (
    <div className="mainDiv"> {/* Wrapper utama untuk styling halaman. */}
      <div className="cardStyle"> {/* Card style untuk form. */}
        <form id="signupForm" onSubmit={handleSubmit}> {/* Form untuk memperbarui password. */}
          <img src={assets.logo} id="signupLogo" alt="Logo" /> {/* Logo aplikasi. */}
          <h2 className="formTitle">Reset Your Password</h2> {/* Judul halaman. */}

          {/* Input untuk password baru. */}
          <div className="inputDiv">
            <label className="inputLabel" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Input untuk konfirmasi password. */}
          <div className="inputDiv">
            <label className="inputLabel" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyUp={validatePassword} // Validasi password setiap kali pengguna mengetik.
              required
            />
          </div>

          {/* Tombol submit untuk memperbarui password. */}
          <div className="buttonWrapper">
            <button type="submit" id="submitButton" className="submitButton">
              <span>Continue</span>
            </button>
          </div>

          {/* Menampilkan pesan error atau sukses. */}
          {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
