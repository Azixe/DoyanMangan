import React from 'react'; // Import React untuk membuat komponen
import './Header.css'; // Import file CSS untuk styling komponen Header

const Header = () => {
    return (
        <div className='header'> {/* Wrapper utama untuk header */}
            <div className="header-contents"> {/* Kontainer untuk isi header */}
                <h2>Pesan makanan favorit kamu di sini</h2>
                {/* Teks utama sebagai judul */}
                <p>Pilihlah dari beragam menu yang menyajikan beragam hidangan lezat</p>
                {/* Teks deskripsi tambahan */}
                <button>View Menu</button>
                {/* Tombol untuk melihat menu (aksi yang bisa dihubungkan dengan navigasi) */}
            </div>
        </div>
    );
}

export default Header; // Mengekspor komponen Header untuk digunakan di tempat lain
