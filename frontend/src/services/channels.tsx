import axios from 'axios';

import {
  User, ChannelType, AddChannelType, AddChannelMembers, ChannelMember,
} from '../utils/types';
import errorMessage from '../utils/errorMessage';

const url = `${API_BASE_URL}/channels`;
const urlChannelMembers = `${API_BASE_URL}/channelMembers`;

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
    throw new Error(errorMessage(error, 'Error GET add channel.'));
  }
};

const addChannelMembers = async (
  channelMembersData: AddChannelMembers,
):Promise<ChannelMember | { message: string }> => {
  try {
    const { data } = await axios.post<ChannelMember | { message: string }>(`${urlChannelMembers}`, channelMembersData);

    return (data);
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET add channel members.'));
  }
};

export default {
  getAll,
  addChannel,
  addChannelMembers,
};
