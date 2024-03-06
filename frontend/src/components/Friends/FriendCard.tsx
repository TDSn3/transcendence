import { useState, useEffect } from 'react';
import { User, UserStatus, UserForStatusWebSocket } from '../../utils/types';
import useSocket from '../../contexts/Socket/useSocket';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import userServices from '../../services/user';

import './friend-card.css';

interface FriendCardProps {
  user: User,
}

function FriendCard({ user }: FriendCardProps) {
  const { socket } = useSocket();
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.OFFLINE);

  const hook = () => {
    userServices
      .getStatus(user.id)
      .then((data) => {
        // TODO: change bool to type
        if (data.status) {
          setUserStatus(UserStatus.ONLINE);
        } else {
          setUserStatus(UserStatus.OFFLINE);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(hook, [user]);

  const hookSocket = () => {
    if (socket !== undefined) {
      const handleMessage = (data: UserForStatusWebSocket) => {
        console.log('Message from web socket: ', data);

        if (data.id === user.id) {
          console.log(`My friend ${user.login} changed status to ${data.status}`);
          setUserStatus(data.status);
        }
      };
      socket.on('message', handleMessage);

      return (() => {
        socket.off('message', handleMessage);
      });
    }

    return (() => {});
  };
  useEffect(hookSocket, [socket, user.id, user.login]);

  return (
    <div className="friend-card">
      <ProfilePicture size="128px" imageUrl={user.avatar} />
      {user.login}
      <br />
      {userStatus === UserStatus.ONLINE ? 'ONLINE' : 'OFFLINE'}
    </div>
  );
}

export default FriendCard;
