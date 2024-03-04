import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import useAuth from '../../contexts/Auth/useAuth';

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
    <div>
      <h3>
        Friends :
        {' '}
        {userWithFriends?.friends?.length ?? 0}
      </h3>
      {
        userWithFriends.friends.map((value) => (
          <div key={uuidv4()}>
            {' '}
            {value.login}
            {' '}
          </div>
        ))
      }
    </div>
  );
}

export default Friends;
