import { useLocation } from 'react-router-dom';
import { User } from '../../../utils/types';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import AntSwitch from '../SwitchButton/AntSwitch';
import useAuth from '../../../contexts/Auth/useAuth';

import '../profile.css';

interface ProfileInformationProps {
  userProfile: User,
  isToggled: boolean,
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>,
}

function ProfileInformation({ userProfile, isToggled, setIsToggled }: ProfileInformationProps) {
  const { user } = useAuth();
  const isUserIsUserProfile = user.id === userProfile.id;
  const location = useLocation();

  return (
    <div className="page profile-style">

      <ProfilePicture size="256px" imageUrl={userProfile.avatar} />

      <h3 style={{ marginLeft: 0, marginBottom: -16 }}>{userProfile.login}</h3>
      <p>
        {userProfile.firstName}
        {' '}
        {userProfile.lastName}
      </p>

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
            <span className="number">{userProfile.wins}</span>
          </p>
          <p className="box">
            Losses&nbsp;&nbsp;
            <span className="number">{userProfile.losses}</span>
          </p>
        </div>
      </div>
      {
        isUserIsUserProfile && /\/profile\/.+/.test(location.pathname) ? (
          <div className="switch-style">
            <AntSwitch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)} />
          </div>
        ) : (
          <> </>
        )
      }
      {
        !isUserIsUserProfile && !(/\/profile\/.+/.test(location.pathname)) ? (
          <button type="button"> add friend </button>
        ) : (
          <> </>
        )
      }
    </div>
  );
}

export default ProfileInformation;
