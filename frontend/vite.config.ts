import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// https://vitejs.dev/config/

dotenv.config();
dotenv.config({ path: './.env' });

const FRONTEND_PORT = process.env.FRONTEND_PORT || '3000';
const BACKEND_PORT = process.env.BACKEND_PORT || '5001';
const API_BASE_URL = `http://localhost:${BACKEND_PORT}/api`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(FRONTEND_PORT),
    host: true,
  },
  define: {
    'FRONTEND_PORT': JSON.stringify(FRONTEND_PORT),
    'BACKEND_PORT': JSON.stringify(BACKEND_PORT),
    'API_BASE_URL': JSON.stringify(API_BASE_URL),
  }
});
