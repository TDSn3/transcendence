/* eslint-disable */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './channel.css';

interface ChannelProps {
  name: string,
  intraId: number,
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>,
}

function Channel({
  name,
  intraId,
  setIsModalVisible,
  setSelectedChannel,
}: ChannelProps) {
  const navigate = useNavigate();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsModalVisible(true);
    setSelectedChannel(name);

    // await axios.post('http://localhost:5001/api/channelMembers', { intraId, channelName: name });

    // navigate(`/chat/${name}`);
  };

  return (
    <button className="channel" type="button" value={name} onClick={handleClick}>
      {name}
    </button>
  );
}

export default Channel;
