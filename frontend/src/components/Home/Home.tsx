import { useState, useEffect } from 'react';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import Search from '../Search/Search';
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

  useEffect(hookUserList, []);

  return (
    <>
      <div className="page">
        <h3>Home</h3>
        <Search
          placeholder="Search"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
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
