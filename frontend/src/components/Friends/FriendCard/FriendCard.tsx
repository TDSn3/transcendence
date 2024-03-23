import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserStatus, UserForStatusWebSocket } from '../../../utils/types';
import useSocket from '../../../contexts/Socket/useSocket';
import useAuth from '../../../contexts/Auth/useAuth';
import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import userServices from '../../../services/user';
import XmarkIconoirButton from '../../Buttons/XmarkIconoirButton/XmarkIconoirButton';
import Status from './Status';

import './friend-card.css';

interface FriendCardProps {
  userFriend: User,
  friendsList: User[],
  setFriendsList: React.Dispatch<React.SetStateAction<User[]>>,
  change: boolean,
  setChange: React.Dispatch<React.SetStateAction<boolean>>,
}

function FriendCard({
  userFriend,
  friendsList,
  setFriendsList,
  change,
  setChange,
}: FriendCardProps) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.OFFLINE);
  const navigate = useNavigate();

  const hook = () => {
    userServices
      .getStatus(userFriend.id)
      .then((data) => setUserStatus(data.status))
      .catch((error) => { console.error(error); });
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

      const handleUpdateStatus = (data: UserForStatusWebSocket) => {
        if (data.id === userFriend.id) {
          console.log(`My friend ${userFriend.login} changed status to ${data.status}`);
          setUserStatus(data.status);
        }
      };
      socket.on('updateStatus', handleUpdateStatus);

      return (() => {
        socket.off('message', handleMessage);
        socket.off('updateStatus', handleUpdateStatus);
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
        setChange(!change);
      })
      .catch((error) => { console.error(error); });
  };

  return (
    <div
      className="friend-card"
      tabIndex={0}
      onClick={handleClick}
      aria-hidden="true"
      role="button"
    >
      <XmarkIconoirButton handleClick={handleClickXmark} />
      <div className="friend-card-picture-container">
        <ProfilePicture size="128px" imageUrl={userFriend.avatar} margin="0px" />
        <div className="background-overlay"> </div>
        <div className="overlay">view profile</div>
      </div>
      <div className="text-container">
        <div className="title">{userFriend.login}</div>
        <div className="subtitle">
          {userFriend.firstName}
          {' '}
          {userFriend.lastName}
        </div>
      </div>
      <Status userStatus={userStatus} />
    </div>
  );
}

export default FriendCard;
