import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePicture from './ProfilePicture/ProfilePicture';
// import GameHistory from './GameHistory/GameHistory';
import AntSwitch from './SwitchButton/AntSwitch';
import { User } from '../../utils/types';
import userServices from '../../services/user';
import typeGuard from '../../utils/typeGuard';

import './profile.css';

function Profile() {
  const { login } = useParams();
  const [isToggled, setIsToggled] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userServices.getUserByLogin(typeGuard.parseString(login));

        setUserProfile(user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Error in Profile: ', error);
        }

        setUserProfile(null);
      }
    };

    fetchUser();
  }, [login]);

  if (userProfile) {
    return (
      <>
        <div className="page profile-style">

          <ProfilePicture size="256px" imageUrl={userProfile.avatar} />

          <h3 style={{ marginLeft: 0 }}>{userProfile.login}</h3>

          <div className="profile-content">
            <div>
              <p className="box">
                Rank&nbsp;&nbsp;
                <span className="number">NULL</span>
              </p>
            </div>
            <div className="wins-losses">
              <p className="box">
                Wins&nbsp;&nbsp;
                <span className="number">NULL</span>
              </p>
              <p className="box">
                Losses&nbsp;&nbsp;
                <span className="number">NULL</span>
              </p>
            </div>
          </div>
          <div className="switch-style">
            <AntSwitch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)} />
          </div>

        </div>

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
