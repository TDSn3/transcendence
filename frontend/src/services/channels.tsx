import axios from 'axios';
import config from '../utils/config';

import {
  User,
  ChannelType,
  AddChannelType,
  AddChannelMembers,
  ChannelMember,
} from '../utils/types';
import errorMessage from '../utils/errorMessage';

const url = `${config.API_BASE_URL}/channels`;
const urlChannelMembers = `${config.API_BASE_URL}/channelMembers`;

const getAll = async (user: User): Promise<ChannelType[]> => {
  try {
    const { data } = await axios.get<ChannelType[]>(`${url}/names`, {
      params: {
        intraId: user.intraId,
      },
    });

    return data;
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET all channels.'));
  }
};

const addChannel = async (newChannel: AddChannelType): Promise<ChannelType> => {
  try {
    const { data } = await axios.post<ChannelType>(`${url}`, newChannel);

    return data;
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET add channel.'));
  }
};

const addChannelMembers = async (
  channelMembersData: AddChannelMembers,
): Promise<ChannelMember | { message: string }> => {
  try {
    const { data } = await axios.post<ChannelMember | { message: string }>(
      `${urlChannelMembers}`,
      channelMembersData,
    );

    return data;
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error GET add channel members.'));
  }
};

const removeChannelMember = async (
  channelName: string,
  intraId: number,
): Promise<void> => {
  try {
    console.log('channelName:', channelName);
    console.log('intraId:', intraId);
    await axios.delete(`${url}/removeMember`, {
      params: {
        channelName,
        intraId,
      },
    });
  } catch (error: unknown) {
    throw new Error(errorMessage(error, 'Error DELETE remove channel member.'));
  }
};

export default {
  getAll,
  addChannel,
  addChannelMembers,
  removeChannelMember,
};
