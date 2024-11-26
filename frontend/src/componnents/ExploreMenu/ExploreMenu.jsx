import React from 'react'; // Import React untuk membuat komponen
import './ExploreMenu.css'; // Import file CSS untuk styling komponen ExploreMenu
import { menu_list } from '../../assets/assets'; // Import daftar menu dari assets

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            {/* Kontainer utama untuk komponen ExploreMenu */}
            <h1>Jelajahi Menu</h1>
            {/* Judul utama bagian ExploreMenu */}
            <p className='explore-menu-text'>Pilih menu favoritmu</p>
            {/* Deskripsi singkat untuk bagian ExploreMenu */}
            <div className="explore-menu-list">
                {/* Kontainer untuk daftar menu */}
                {menu_list.map((item, index) => {
                    return (
                        <div
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                            key={index}
                            className='explore-menu-list-item'>
                            {/* Setiap item menu dapat diklik untuk memilih kategori.
                                Jika kategori yang dipilih adalah kategori yang sama, maka diatur kembali ke "All" */}
                            <img
                                className={category === item.menu_name ? "active" : ""}
                                src={item.menu_image}
                                alt=""
                            />
                            {/* Menampilkan gambar menu, ditandai dengan class "active" jika kategori aktif */}
                            <p>{item.menu_name}</p>
                            {/* Menampilkan nama menu */}
                        </div>
                    );
                })}
            </div>
            <hr /> {/* Garis horizontal untuk pemisah visual */}
        </div>
    );
}

export default ExploreMenu; // Mengekspor komponen ExploreMenu untuk digunakan di tempat lain
