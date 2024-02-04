import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// https://vitejs.dev/config/

dotenv.config();
dotenv.config({ path: '../.env' });

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.FRONTEND_PORT),
    host: true,
  },
});
