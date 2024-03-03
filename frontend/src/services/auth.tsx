import axios from 'axios';

import { User } from '../utils/types';

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
    let errorMessage = 'Error during disconnection.';

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
  logoutUser,
};
