import axios from 'axios';

import { User } from '../utils/types';
import errorMessage from '../utils/errorMessage';

const logoutUser = async (user: User) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, { user }, { withCredentials: true });

    if (response.status === 200) {
      console.log(user.login, 'logout.');
      return (null);
    }
    console.error('Error during disconnection:', response.data);
    throw new Error('Failed to logout');
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error during disconnection.'));
  }
};

const addFakeUser = async () => {
  const fakeUser = {
    code: 'fakeCode',
    otp: 'fakeOtp',
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/FakeUsers`, fakeUser, { withCredentials: true });

    if (response.status === 200) {
      console.log('User data:', response.data.user);

      return (response.data.user);
    }
    console.error('Failed to create user:', response.data);
    throw new Error('Failed to create user');
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error creating user.'));
  }
};

const authentication42 = async (code: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/signin42`, {
      params: { code },
      withCredentials: true,
    });

    if (response.status === 200) {
      console.log('User data:', response.data.user);

      return (response.data.user);
    }
    console.error('User not found:', response.data);
    throw new Error('User not found');
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'User not found.'));
  }
};

export default {
  logoutUser,
  addFakeUser,
  authentication42,
};
