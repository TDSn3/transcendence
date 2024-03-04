import axios from 'axios';

import { User } from '../utils/types';

const url = `${API_BASE_URL}/users`;

const getAll = async () => {
  try {
    const { data } = await axios.get<User[]>(`${url}`);

    return (data);
  } catch (error: unknown) {
    let errorMessage = 'Error GET User by ID.';

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

const getUserById = async (id: string): Promise<User> => {
  try {
    const { data } = await axios.get<User>(`${url}/id/${id}`);

    return (data);
  } catch (error: unknown) {
    let errorMessage = 'Error GET User by ID.';

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

const getUserByLogin = async (login: string): Promise<User> => {
  try {
    const { data } = await axios.get<User>(`${url}/login/${login}`);

    return (data);
  } catch (error: unknown) {
    let errorMessage = 'Error GET User by LOGIN.';

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
  getUserById,
  getUserByLogin,
};
