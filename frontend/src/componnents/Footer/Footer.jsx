import React from 'react'; // Mengimpor React
import './Footer.css'; // Mengimpor file CSS untuk styling
import { assets } from '../../assets/assets'; // Mengimpor aset yang digunakan dalam footer

const Footer = () => {
    return (
        <div className="footer" id="footer">
            <div className="footer-content">
                {/* Bagian kiri footer */}
                <div className="footer-content-left">
                    {/* Logo perusahaan */}
                    <img src={assets.logo} alt="Company Logo" />
                    {/* Deskripsi singkat */}
                    <p>tes</p>
                    {/* Ikon media sosial */}
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="Facebook" />
                        <img src={assets.twitter_icon} alt="Twitter" />
                        <img src={assets.linkedin_icon} alt="LinkedIn" />
                    </div>
                </div>

                {/* Bagian tengah footer */}
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        {/* Daftar tautan */}
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                {/* Bagian kanan footer */}
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        {/* Kontak perusahaan */}
                        <li>0895377128083</li>
                        <li>contact@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/* Garis pemisah */}
            <hr />
            {/* Hak cipta */}
            <p className="footer-copyright">
                Copyright 2024 @ DoyaMangan.com - All Right Reserved
            </p>
        </div>
    );
};

export default Footer; // Mengekspor komponen Footer
