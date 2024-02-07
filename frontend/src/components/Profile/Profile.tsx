import { User, GameResult } from '../../utils/types';
import ProfilePicture from './ProfilePicture/ProfilePicture';
import GameHistory from './GameHistory/GameHistory';

import './profile.css';

const gameResult: GameResult[] = [
  {
    players: [
      {
        user: {
          username: 'tda-silv',
          profilePictureUrl: 'https://avatars.githubusercontent.com/u/92325211?v=4',
        },
        score: 10,
        won: true,
      },
      {
        user: {
          username: 'Boby-Booba',
          profilePictureUrl: 'https://avatars.githubusercontent.com/u/86242235?v=4',
        },
        score: 3,
        won: false,
      },
    ],
  },
  {
    players: [
      {
        user: {
          username: 'tda-silv',
          profilePictureUrl: 'https://avatars.githubusercontent.com/u/92325211?v=4',
        },
        score: 1,
        won: false,
      },
      {
        user: {
          username: 'Boby-Booba',
          profilePictureUrl: 'https://avatars.githubusercontent.com/u/86242235?v=4',
        },
        score: 10,
        won: true,
      },
    ],
  },
];

const user: User = {
  username: 'tda-silv',
  profilePictureUrl: 'https://avatars.githubusercontent.com/u/92325211?v=4',
  rank: 1,
  gamesWon: 2,
  gamesLost: 3,
  gameHistory: gameResult,
};

function Profile() {
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
