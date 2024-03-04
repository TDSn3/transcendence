import axios from 'axios';

import { User } from '../utils/types';

const url = `${API_BASE_URL}/users`;

const getAll = async () => {
  const { data } = await axios.get<User[]>(`${url}`);
  console.log('All ', data);

  return (data);
};

const getUserById = async (id: string): Promise<User> => {
  const { data } = await axios.get<User>(`${url}/id/${id}`);

  return (data);
};

const getUserByLogin = async (login: string): Promise<User> => {
  const { data } = await axios.get<User>(`${url}/login/${login}`);

  return (data);
};

export default {
  getAll,
  getUserById,
  getUserByLogin,
};
