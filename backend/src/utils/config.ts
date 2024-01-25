import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../.env' });

const PORT = process.env.BACKEND_PORT;

export default {
  PORT,
};
