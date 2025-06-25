import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // 👈 This makes it accessible on your network IP
    port: 5172, // 👈 Optional: specify the port
  },
})
