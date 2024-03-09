import { useState, useEffect } from 'react';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import useAuth from '../../contexts/Auth/useAuth';
import FriendCard from './FriendCard';

import './friends.css';

function Friends() {
  const { user } = useAuth();
  const [userWithFriends, setUserWithFriends] = useState<User>(user);
  const [friendsList, setFriendsList] = useState<User[]>([]);

  const hook = () => {
    userServices
      .getUserById(user.id)
      .then((userValue) => {
        setUserWithFriends(userValue);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(hook, [user, friendsList]);

  const friendsListHook = () => {
    setFriendsList(userWithFriends?.friends?.map((userValue) => userValue));
  };
  useEffect(friendsListHook, [userWithFriends?.friends]);

  return (
    <div className="void-page" id="friends-page-id">
      <h3 className="friends-title">
        Friends :
        {' '}
        {userWithFriends?.friends?.length ?? 0}
      </h3>
      <div className="friend-card-container-parent">
        {
          friendsList?.map((userValue) => (
            <div key={userValue.id} className="friend-card-container">
              <FriendCard
                userFriend={userValue}
                friendsList={friendsList}
                setFriendsList={setFriendsList}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Friends;
