import { useState, useEffect } from 'react';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import useAuth from '../../contexts/Auth/useAuth';
import FriendCard from './FriendCard';

import './friends.css';

function Friends() {
  const { user } = useAuth();
  const [userWithFriends, setUserWithFriends] = useState<User>(user);

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

  useEffect(hook, [user]);

  return (
    <div className="void-page" id="friends-page-id">
      <h3 className="friends-title">
        Friends :
        {' '}
        {userWithFriends?.friends?.length ?? 0}
      </h3>
      <div className="friend-card-container-parent">
        {
          userWithFriends?.friends?.map((userValue) => (
            <div key={userValue.id} className="friend-card-container">
              <FriendCard user={userValue} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Friends;
