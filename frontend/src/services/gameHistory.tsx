import axios from 'axios';
import { UserGameHistory } from '../utils/types';

const url = `${API_BASE_URL}/users-game-histories`;

const getAll = async () => {
  const { data } = await axios.get<UserGameHistory[]>(`${url}`);

  return (data);
};

const getUserGameHistory = async (id: string): Promise<UserGameHistory> => {
  const { data } = await axios.get<UserGameHistory>(`${url}/${id}`);

  return (data);
};

export default {
  getAll,
  getUserGameHistory,
};
