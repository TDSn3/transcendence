import axios from 'axios';
import { User } from '../utils/types';

const usersUrl = `${API_BASE_URL}/users`;

const getAll = async () => {
  const { data } = await axios.get<User[]>(`${usersUrl}`);

  return (data);
};

const getUser = async (id: string): Promise<User> => {
  const { data } = await axios.get<User>(`${usersUrl}/${id}`);

  return (data);
};

export default {
  getAll,
  getUser,
};
