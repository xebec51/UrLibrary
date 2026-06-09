import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Pastikan ini sesuai dengan plugin yang Anda gunakan (react atau react-swc)
import tailwindcss from '@tailwindcss/vite'; // Import plugin Vite Tailwind CSS

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Gunakan plugin Vite Tailwind CSS
  ],
});