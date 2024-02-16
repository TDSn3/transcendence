import * as dotenv from 'dotenv';
import typeGuard from './typeGuard';

dotenv.config();
dotenv.config({ path: '../.env' });

let FRONTEND_PORT;
let BACKEND_PORT;

try {
  FRONTEND_PORT = typeGuard.parseString(process.env.FRONTEND_PORT);
  BACKEND_PORT = typeGuard.parseString(process.env.BACKEND_PORT);
} catch (error) {
  console.error(
    'FRONTEND_PORT or BACKEND_PORT environment variables are not defined.',
  );
  console.error('Default ports have been set instead:');
  console.error('- FRONTEND_PORT = 3000.');
  console.error('- BACKEND_PORT = 5001.');

  FRONTEND_PORT = '3000';
  BACKEND_PORT = '5001';
}

export default {
  FRONTEND_PORT,
  BACKEND_PORT,
};
