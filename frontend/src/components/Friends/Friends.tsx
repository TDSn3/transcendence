import { useState, useEffect } from 'react';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import useAuth from '../../contexts/Auth/useAuth';
import FriendCard from './FriendCard/FriendCard';
import Search from '../Search/Search';

import './friends.css';

function Friends() {
  const { user } = useAuth();
  const [userWithFriends, setUserWithFriends] = useState<User>(user);
  const [friendsList, setFriendsList] = useState<User[]>([]);

  const [searchValue, setSearchValue] = useState<string>('');
  const [userList, setUserList] = useState<User []>([]);

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

  const hookUserList = () => {
    userServices
      .getAll()
      .then((usersListResponse) => {
        console.log('userList : ', usersListResponse);
        setUserList(usersListResponse);
      });
  };
  useEffect(hookUserList, []);

  return (
    <div className="void-page" id="friends-page-id">
      <div className="friends-header">
        <div className="friends-title">
          <h3>
            Friends :
            {' '}
            {userWithFriends?.friends?.length ?? 0}
          </h3>
        </div>
        <Search
          placeholder="Search"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          userList={userList}
        />
      </div>
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
