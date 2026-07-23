import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Assuming you are using React based on previous logs

export default defineConfig({

    envDir: '../',
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/app.jsx' // Note: Change this to .js or .tsx if your project uses those extensions
            ],
            refresh: true,
        }),
        react(),
    ],
});