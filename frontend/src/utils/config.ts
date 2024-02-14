import typeGuard from './typeGuard';

let FRONTEND_PORT;
let BACKEND_PORT;

try {
  FRONTEND_PORT = typeGuard.parseString(__FRONTEND_PORT__);
  BACKEND_PORT = typeGuard.parseString(__BACKEND_PORT__);
} catch (error) {
  console.error('FRONTEND_PORT or BACKEND_PORT environment variables are not defined.');
  console.error('Default ports have been set instead:');
  console.error('- FRONTEND_PORT = 3000.');
  console.error('- BACKEND_PORT = 5001.');

  FRONTEND_PORT = '3000';
  BACKEND_PORT = '5001';
}

const API_BASE_URL = `http://localhost:${BACKEND_PORT}/api`;

export default {
  FRONTEND_PORT,
  BACKEND_PORT,
  API_BASE_URL,
};
