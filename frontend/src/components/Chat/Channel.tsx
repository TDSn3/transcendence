import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChannelType } from '../../utils/types';
import useAuth from '../../contexts/Auth/useAuth';

import './channel.css';

interface ChannelProps {
  name: string,
  channelsNames: ChannelType[] | undefined,
  selectedChannelData: ChannelType | undefined,
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  selectedChannel: string,
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>,
  setIsModalVisiblePasswordChannel: React.Dispatch<React.SetStateAction<boolean>>,
  setModalPasswordChannelValue: React.Dispatch<React.SetStateAction<string>>,
}

function Channel({
  name,
  channelsNames,
  selectedChannelData,
  setIsModalVisible,
  selectedChannel,
  setSelectedChannel,
  setIsModalVisiblePasswordChannel,
  setModalPasswordChannelValue,
}: ChannelProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    console.log('==========+>', selectedChannelData);

    if (selectedChannelData && selectedChannelData?.password === '') {
      console.log('ICI');
      axios
        .post('http://localhost:5001/api/channelMembers', { intraId: user.intraId, channelName: selectedChannelData.name })
        .then(() => {
          setIsModalVisiblePasswordChannel(false);
          setSelectedChannel('');
          setModalPasswordChannelValue('');

          navigate(`/chat/${selectedChannelData.name}`);
        });
    }

    setIsModalVisible(true);
    setSelectedChannel(name);
  };

  return (
    <button className="channel" type="button" value={name} onClick={handleClick}>
      {name}
    </button>
  );
}

export default Channel;
