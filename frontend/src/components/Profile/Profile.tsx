import { User, GameResult } from '../../utils/types';
import ProfilePicture from './ProfilePicture/ProfilePicture';

import './profile.css';

const user: User = {
  username: 'tda-silv',
  profilePictureUrl: 'https://avatars.githubusercontent.com/u/92325211?v=4',
  rank: 1,
  gamesWon: 2,
  gamesLost: 3,
};

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
  }
];

const Profile = () =>
{
  return (
    <>
      <div className='page profile-style'>

        <ProfilePicture size='256px' imageUrl={user.profilePictureUrl}/>

        <h3 style={{ marginLeft: 0 }} >{user.username}</h3>

        <div className='profile-content'>
          <div>
            <p className='box'>Rank&nbsp;&nbsp;<span className='number'>{user.rank}</span></p>
          </div>
          <div className='wins-losses'>
            <p className='box'>Wins&nbsp;&nbsp;<span className='number'>{user.gamesWon}</span></p>
            <p className='box'>Losses&nbsp;&nbsp;<span className='number'>{user.gamesWon}</span></p>
          </div>
        </div>

      </div>

      <div className='page'>

        <h3 className='game-history-title-style'>Game History</h3>

        <div className='game-result-container'>
          {
            gameResult.map((value, index) => {
              return (
                <div key={index} className='game-result'>
                  {value.players[0].user.username}
                  <ProfilePicture size='64px' imageUrl={value.players[0].user.profilePictureUrl}/>

                  <span className={ value.players[0].won ? 'big-number-won' : 'big-number-lose' }>{value.players[0].score}</span>
                  <span className='big-number-won'>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
                  <span className={ value.players[1].won ? 'big-number-won' : 'big-number-lose' }>{value.players[1].score}</span>

                  <ProfilePicture size='64px' imageUrl={value.players[1].user.profilePictureUrl}/>
                  {value.players[1].user.username}
                </div>
              );
            }, 0)
          }
        </div>

      </div>
    </>
  );
};

export default Profile;
