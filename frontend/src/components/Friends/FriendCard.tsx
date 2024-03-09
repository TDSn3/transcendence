import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const hook = () => {
    userServices
      .getStatus(user.id)
      .then((data) => {
        if (data.status === UserStatus.ONLINE) {
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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>
  | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    navigate(`/profile/${user.login}`);
  };

  return (
    <div
      className="friend-card"
      tabIndex={0}
      onClick={handleClick}
      aria-hidden="true"
      role="button"
    >
      <div className="background-overlay"> </div>
      <div className="overlay">view profile</div>
      <ProfilePicture size="128px" imageUrl={user.avatar} />
      <div className="text-container">
        <div className="title">{user.login}</div>
        <div className="subtitle">
          {user.firstName}
          {' '}
          {user.lastName}
        </div>
      </div>
      <div className={userStatus === UserStatus.ONLINE ? 'online' : 'offline'}>
        {userStatus === UserStatus.ONLINE ? 'ONLINE' : 'OFFLINE'}
      </div>
    </div>
  );
}

export default FriendCard;
