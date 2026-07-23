import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import { bunny } from "laravel-vite-plugin/fonts";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/src/index.jsx", // Entry point React project kamu
            ],
            refresh: true,
            fonts: [
                bunny("Instrument Sans", {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        react(), // Plugin React aktif
        tailwindcss(),
    ],
    // Mencegah error jika ada file .js yang berisi sintaks JSX
    esbuild: {
        loader: "jsx",
        include: /resources\/js\/.*\.jsx?$/,
    },
    server: {
        host: "127.0.0.1", // Paksa IPv4 agar tidak bentrok dengan [::1]
        port: 5173,
        watch: {
            ignored: ["**/storage/framework/views/**"],
        },
    },
});
