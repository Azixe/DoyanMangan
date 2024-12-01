import React, { useContext, useState } from 'react'; // Import React, hooks untuk state dan context
import './Navbar.css'; // Import file CSS untuk styling Navbar
import { assets } from '../../assets/assets'; // Import objek assets untuk mengakses ikon dan gambar
import { Link, useNavigate } from 'react-router-dom'; // Import Link dan useNavigate dari react-router-dom
import { StoreContext } from '../../context/StoreContext'; // Import context untuk manajemen global state

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("menu"); // State untuk menentukan menu yang aktif

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    // Mengambil fungsi dan state dari StoreContext

    const navigate = useNavigate(); // Hook untuk navigasi antar halaman

    const logout = () => {
        // Fungsi logout, menghapus token dari localStorage dan mengubah state token
        localStorage.removeItem("token");
        setToken("");
        navigate("/"); // Navigasi ke halaman utama setelah logout
    };

    return (
        <div className='navbar'> {/* Wrapper utama navbar */}
            <Link to='/'>
                <img src={assets.logo} alt="" className="logo" /> {/* Logo aplikasi */}
            </Link>
            <ul className="navbar-menu"> {/* Menu navigasi utama */}
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
                    home
                </Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
                    menu
                </a>
                <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>
                    contact us
                </a>
            </ul>
            <div className="navbar-right"> {/* Bagian kanan navbar */}
                <div className="navbar-icon">
                    <Link to='/cart'>
                        <img src={assets.basket_icon} alt="" /> {/* Ikon keranjang */}
                    </Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    {/* Menampilkan titik jika ada barang di keranjang */}
                </div>
                {!token ?
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                    // Tombol untuk login jika user belum login
                    :
                    <div className='navbar-profile'> {/* Dropdown profil jika user sudah login */}
                        <img src={assets.profile_icon} alt="" /> {/* Ikon profil */}
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>
                                <img src={assets.bag_icon} alt="" />
                                <p>Orders</p> {/* Navigasi ke halaman "My Orders" */}
                            </li>
                            <hr /> {/* Garis pembatas */}
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Logout</p> {/* Logout */}
                            </li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar; // Ekspor komponen Navbar
