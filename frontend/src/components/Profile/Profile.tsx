import { User } from '../../utils/types';
import ProfilePicture from './ProfilePicture/ProfilePicture';
import GameHistory from './GameHistory/GameHistory';

import './profile.css';

interface ProfileProps {
  user: User,
}

function Profile({ user }: ProfileProps) {
  return (
    <>
      <div className="page profile-style">

        <ProfilePicture size="256px" imageUrl={user.profilePictureUrl} />

        <h3 style={{ marginLeft: 0 }}>{user.username}</h3>

        <div className="profile-content">
          <div>
            <p className="box">
              Rank&nbsp;&nbsp;
              <span className="number">{user.rank}</span>
            </p>
          </div>
          <div className="wins-losses">
            <p className="box">
              Wins&nbsp;&nbsp;
              <span className="number">{user.gamesWon}</span>
            </p>
            <p className="box">
              Losses&nbsp;&nbsp;
              <span className="number">{user.gamesWon}</span>
            </p>
          </div>
        </div>

      </div>

      <div className="page">

        <h3 className="game-history-title-style">Game History</h3>

        <GameHistory user={user} />

      </div>
    </>
  );
}

export default Profile;
