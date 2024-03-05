import { useState, useEffect } from 'react';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import Search from '../Search/Search';
import UserList from '../UserList/UserList';
import ProfileInformation from '../Profile/ProfileInformation/ProfileInformation';

function Home() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [userList, setUserList] = useState<User []>([]);
  const [userShowProfile, setUserShowProfile] = useState<User | null>(null);

  const hookUserList = () => {
    userServices
      .getAll()
      .then((usersListResponse) => {
        console.log('userList : ', usersListResponse);
        setUserList(usersListResponse);
      });
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setSearchValue(event.target.value);

  useEffect(hookUserList, []);

  return (
    <>
      <div className="page">
        <h3>Home</h3>
        <Search
          placeholder="Search"
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
        />
        <UserList
          searchValue={searchValue}
          userList={userList}
          setUserShowProfile={setUserShowProfile}
        />
      </div>
      {
        userShowProfile ? (
          <ProfileInformation
            userProfile={userShowProfile}
            isToggled={false}
            setIsToggled={() => {}}
          />
        ) : (
          <> </>
        )
      }
    </>
  );
}

export default Home;
