import axios from 'axios';

import { User, UserStatus } from '../utils/types';
import errorMessage from '../utils/errorMessage';

const url = `${API_BASE_URL}/users`;

const getAll = async () => {
  try {
    const { data } = await axios.get<User[]>(`${url}`);

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET all User.'));
  }
};

const getUserById = async (id: string): Promise<User> => {
  try {
    const { data } = await axios.get<User>(`${url}/id/${id}`);

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET User by ID.'));
  }
};

const getUserByLogin = async (login: string): Promise<User> => {
  try {
    const { data } = await axios.get<User>(`${url}/login/${login}`);

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET User by LOGIN.'));
  }
};

const addFriend = async (userId: string, userIdToAdd: string): Promise<User> => {
  try {
    const { data } = await axios.post<User>(`${url}/id/ad-friend/${userId}`, {
      idUserToAddAsFriend: userIdToAdd,
    });

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error POST add friend.'));
  }
};

const deleteFriend = async (userId: string, userIdToDel: string): Promise<User> => {
  try {
    const { data } = await axios.post<User>(`${url}/id/del-friend/${userId}`, {
      idUserToDelAsFriend: userIdToDel,
    });

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error POST add friend.'));
  }
};

const getStatus = async (userId: string): Promise<{ status: UserStatus }> => {
  try {
    const { data } = await axios.get<{ status: UserStatus }>(`${url}/status/id/${userId}`);

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET get status.'));
  }
};

export default {
  getAll,
  getUserById,
  getUserByLogin,
  addFriend,
  deleteFriend,
  getStatus,
};
