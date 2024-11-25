import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='header'>
            <div className="header-contents">
                <h2>Pesan makanan favorit kamu di sini</h2>
                <p>Pilihlah dari beragam menu yang menyajikan beragam hidangan lezat</p>
                <button>View Menu</button>
            </div>
        </div>
    )
}

export default Header
