import React, { useContext, useState } from 'react';
import './ResetPassword.css'; // Tambahkan file CSS untuk halaman ini
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(url + "/api/user/reset-password", { email });
            if (response.data.success) {
                setMessage('A password reset link has been sent to your email!');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='reset-password'>
            <form onSubmit={handleResetPassword} className="reset-password-container">
                <h2>Reset Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
                {message && <p className="reset-password-message">{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;