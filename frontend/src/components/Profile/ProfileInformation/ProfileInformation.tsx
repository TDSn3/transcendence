import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '../../../utils/types';
import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import AntSwitch from '../SwitchButton/AntSwitch';
import useAuth from '../../../contexts/Auth/useAuth';
import userServices from '../../../services/user';
import OtherProfilePublicInfo from './OtherProfilePublicInfo';

import '../profile.css';

interface ProfileInformationProps {
  userProfile: User,
  isToggled: boolean,
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>,
}

function ProfileInformation({ userProfile, isToggled, setIsToggled }: ProfileInformationProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isUserIsUserProfile = user.id === userProfile.id;
  const [isFriend, setIsFriend] = useState<boolean | undefined>();

  const handleAddFriendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    userServices
      .addFriend(user.id, userProfile.id)
      .then(() => setIsFriend(true))
      .catch((error) => console.error(error));
  };

  const handleDelFriendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    userServices
      .deleteFriend(user.id, userProfile.id)
      .then(() => setIsFriend(false))
      .catch((error) => console.error(error));
  };

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
          <OtherProfilePublicInfo
            isFriend={isFriend}
            setIsFriend={setIsFriend}
            userProfile={userProfile}
            handleAddFriendClick={handleAddFriendClick}
            handleDelFriendClick={handleDelFriendClick}
          />
        )
      }
    </div>
  );
}

export default ProfileInformation;
