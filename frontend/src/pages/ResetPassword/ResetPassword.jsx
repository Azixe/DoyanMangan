import React, { useState } from 'react';
import './ResetPassword.css'; // Tambahkan file CSS untuk halaman ini
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://your-api-url/api/user/reset-password', { email });
            if (response.data.success) {
                setMessage('Email untuk reset password telah dikirim!');
                setTimeout(() => navigate('/'), 3000); // Redirect ke halaman utama setelah 3 detik
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('Terjadi kesalahan, silakan coba lagi.');
        }
    };

    return (
        <div className='reset-password'>
            <form onSubmit={handleResetPassword} className="reset-password-container">
                <h2>Reset Password</h2>
                <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Kirim Email Reset</button>
                {message && <p className="reset-password-message">{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
