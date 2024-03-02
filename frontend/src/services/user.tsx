import axios from 'axios';

import {
  User,
  AuthResponse,
  transformAuthResponseToUser,
} from '../utils/types';

const url = `${API_BASE_URL}/users`;

const getAll = async () => {
  const { data } = await axios.get<User[]>(`${url}`);

  return (data);
};

const getUser = async (id: string): Promise<User> => {
  const { data } = await axios.get<User>(`${url}/${id}`);

  return (data);
};

const addFakeUser = async () => {
  const fakeUser = {
    code: 'fakeCode',
    otp: 'fakeOtp',
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/FakeUsers`, fakeUser, { withCredentials: true });

    if (response.status === 200) {
      const userData: AuthResponse = response.data.user;
      const userGoodData: User = transformAuthResponseToUser(userData);

      console.log('User data:', userGoodData);
      return (userGoodData);
    }
    console.error('Failed to create user:', response.data);
    throw new Error('Failed to create user');
  } catch (error: unknown) {
    let errorMessage = 'Error creating user.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage += ` Data: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage += ` No response. Data: ${error.request}`;
      } else {
        errorMessage += ` ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage += ` Other than Axios: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
};

const authentication42 = async (code: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/signin42`, {
      params: { code },
      withCredentials: true,
    });

    if (response.status === 200) {
      const userData: AuthResponse = response.data.user;
      const userGoodData: User = transformAuthResponseToUser(userData);

      console.log('User data:', userGoodData);
      return (userGoodData);
    }
    console.error('User not found:', response.data);
    throw new Error('User not found');
  } catch (error: unknown) {
    let errorMessage = 'User not found.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage += ` Data: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage += ` No response. Data: ${error.request}`;
      } else {
        errorMessage += ` ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage += ` Other than Axios: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
};

export default {
  getAll,
  getUser,
  addFakeUser,
  authentication42,
};
