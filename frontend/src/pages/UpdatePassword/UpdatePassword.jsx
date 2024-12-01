import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './UpdatePassword.css';
import axios from 'axios';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams(); // Extract URL parameters
    const token = searchParams.get('token'); // Get 'token' from URL

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/user/update-password', { token, password });
            setMessage(response.data.message); // Show success or error message
        } catch (error) {
            setMessage('Error updating password');
        }
    };

    return (
        <div className="update-password">
            <form onSubmit={handleUpdatePassword} className="update-password-container">
                <h2>Update Password</h2>
                <input
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Update Password</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default UpdatePassword;
