import ProfilePicture from './ProfilePicture/ProfilePicture';

import './profile.css';

interface User {
  username: string,
  profilePictureUrl: string,
  rank: number,
  gamesWon: number,
  gamesLost: number,
}

const user: User = {
  username: 'tda-silv',
  profilePictureUrl: 'https://avatars.githubusercontent.com/u/92325211?v=4',
  rank: 1,
  gamesWon: 2,
  gamesLost: 3,
};

const Profile = () =>
{
  return (
    <>
      <div className='page profile-style'>

        <ProfilePicture imageUrl={user.profilePictureUrl}/>

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

        <h3>Game History</h3>

      </div>
    </>
  );
};

export default Profile;
