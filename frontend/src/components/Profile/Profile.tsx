import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import GameHistory from './GameHistory/GameHistory';
import { User, emptyUser } from '../../utils/types';
import userServices from '../../services/user';
import typeGuard from '../../utils/typeGuard';
import ProfileInformation from './ProfileInformation/ProfileInformation';

import './profile.css';

function Profile() {
  const { login } = useParams();
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(emptyUser);

  const hookUserList = () => {
    userServices
      .getUserByLogin(typeGuard.parseString(login))
      .then((user) => setUserProfile(user))
      .catch((error) => {
        console.error(error);
        setUserProfile(null);
      });
  };
  useEffect(hookUserList, [login]);

  if (userProfile) {
    return (
      <>
        <ProfileInformation
          userProfile={userProfile}
          isToggled={isToggled}
          setIsToggled={setIsToggled}
        />

        <div className="page">

          <h3 className="game-history-title-style">Game History</h3>

          {/* <GameHistory user={user} /> */}

        </div>

      </>
    );
  }

  return (
    <h1>
      Not found
    </h1>
  );
}

export default Profile;
