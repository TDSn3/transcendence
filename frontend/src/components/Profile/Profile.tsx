import { useState } from 'react';
import { User } from '../../utils/types';
import ProfilePicture from './ProfilePicture/ProfilePicture';
// import GameHistory from './GameHistory/GameHistory';
import Switch from './SwitchButton/Switch';

import './profile.css';

interface ProfileProps {
  user: User,
}

function Profile({ user }: ProfileProps) {
  const [isToggled, setIsToggled] = useState(false);
  console.log('===> ', user);
  console.log('isToggled', isToggled);

  return (
    <>
      <div className="page profile-style">

        <ProfilePicture size="256px" imageUrl={user.avatar} />

        <h3 style={{ marginLeft: 0 }}>{user.login}</h3>

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
          <Switch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)} />
        </div>

      </div>

      <div className="page">

        <h3 className="game-history-title-style">Game History</h3>

        {/* <GameHistory user={user} /> */}

      </div>

    </>
  );
}

export default Profile;
