import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserStatus, UserForStatusWebSocket } from '../../../utils/types';
import useSocket from '../../../contexts/Socket/useSocket';
import useAuth from '../../../contexts/Auth/useAuth';
import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import userServices from '../../../services/user';
import XmarkIconoirButton from '../../Buttons/XmarkIconoirButton/XmarkIconoirButton';

import './friend-card.css';

interface FriendCardProps {
  userFriend: User,
  friendsList: User[],
  setFriendsList: React.Dispatch<React.SetStateAction<User[]>>,
}

function FriendCard({ userFriend, friendsList, setFriendsList }: FriendCardProps) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.OFFLINE);
  const navigate = useNavigate();

  const hook = () => {
    userServices
      .getStatus(userFriend.id)
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
  useEffect(hook, [userFriend]);

  const hookSocket = () => {
    if (socket !== undefined) {
      const handleMessage = (data: UserForStatusWebSocket) => {
        if (data.id === userFriend.id) {
          console.log(`My friend ${userFriend.login} changed status to ${data.status}`);
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
  useEffect(hookSocket, [socket, userFriend.id, userFriend.login]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>
  | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    navigate(`/profile/${userFriend.login}`);
  };

  const handleClickXmark = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    userServices
      .deleteFriend(user.id, userFriend.id)
      .then(() => {
        const copyList = [...friendsList];

        setFriendsList(copyList.filter((friend) => friend.id !== userFriend.id));
      })
      .catch((error) => {
        console.error(error);
      });
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
      <XmarkIconoirButton handleClick={handleClickXmark} />
      <ProfilePicture size="128px" imageUrl={userFriend.avatar} />
      <div className="text-container">
        <div className="title">{userFriend.login}</div>
        <div className="subtitle">
          {userFriend.firstName}
          {' '}
          {userFriend.lastName}
        </div>
      </div>
      <div className={userStatus === UserStatus.ONLINE ? 'online' : 'offline'}>
        {userStatus === UserStatus.ONLINE ? 'ONLINE' : 'OFFLINE'}
      </div>
    </div>
  );
}

export default FriendCard;
