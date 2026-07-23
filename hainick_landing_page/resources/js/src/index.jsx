import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Ambil elemen HTML tempat React akan di-mount (div #root di Blade)
const rootElement = document.getElementById("root");

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>,
    );
} else {
    console.error(
        "Elemen dengan id 'root' tidak ditemukan. Pastikan ada <div id='root'></div> di file Blade kamu.",
    );
}
