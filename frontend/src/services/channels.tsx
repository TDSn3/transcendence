import axios from 'axios';

import { User, UserStatus } from '../utils/types';
import errorMessage from '../utils/errorMessage';

const url = `${API_BASE_URL}/channels`;

const getAll = async () => {
  try {
    const { data } = await axios.get<User[]>(`${url}/names`);

    return data;
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET all User.'));
  }
};

export default {
  getAll,
};
