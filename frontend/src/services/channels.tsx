import axios from 'axios';

import { User, ChannelType, AddChannelType } from '../utils/types';
import errorMessage from '../utils/errorMessage';

const url = `${API_BASE_URL}/channels`;

const getAll = async (user: User): Promise<ChannelType[]> => {
  try {
    const { data } = await axios.get<ChannelType[]>(`${url}/names`, {
      params: {
        intraId: user.intraId,
      },
    });

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET all channels.'));
  }
};

const addChannel = async (newChannel: AddChannelType): Promise<ChannelType> => {
  try {
    const { data } = await axios.post<ChannelType>(`${url}`, newChannel);

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET all channels.'));
  }
};

export default {
  getAll,
  addChannel,
};
