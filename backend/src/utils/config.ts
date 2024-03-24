import * as dotenv from 'dotenv';
import typeGuard from './typeGuard';

dotenv.config();
dotenv.config({ path: '../.env' });
dotenv.config({ path: '../.env.private' });

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

if (
  !process.env.API_42_UID ||
  !process.env.API_42_SECRET ||
  !process.env.JWT_SECRET ||
  !process.env.JWT_REFRESH_SECRET
) {
  console.error('Error : `.env.private` file needed at root.');
}

export default {
  FRONTEND_PORT,
  BACKEND_PORT,
};
