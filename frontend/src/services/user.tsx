import axios from 'axios';
import { User } from '../utils/types';

const url = `${API_BASE_URL}/users`;

const getAll = async () => {
  const { data } = await axios.get<User[]>(`${url}`);

  return (data);
};

const getUser = async (id: string): Promise<User> => {
  const { data } = await axios.get<User>(`${url}/${id}`);

  return (data);
};

export default {
  getAll,
  getUser,
};
