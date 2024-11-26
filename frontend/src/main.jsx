import { createRoot } from 'react-dom/client';
// Import metode `createRoot` dari React untuk merender aplikasi ke DOM

import App from './App.jsx';
// Import komponen utama aplikasi

import './index.css';
// Import file CSS global untuk styling aplikasi

import { BrowserRouter } from 'react-router-dom';
// Import `BrowserRouter` untuk mengatur navigasi menggunakan React Router

import StoreContextProvider from './context/StoreContext.jsx';
// Import `StoreContextProvider` untuk menyediakan state global melalui Context API

// Render aplikasi ke elemen dengan ID 'root' di file HTML
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* Menyediakan aplikasi dengan `BrowserRouter` untuk mendukung routing */}
    <StoreContextProvider>
      {/* Menyediakan state global untuk aplikasi melalui `StoreContextProvider` */}
      <App />
      {/* Komponen utama aplikasi */}
    </StoreContextProvider>
  </BrowserRouter>
);
