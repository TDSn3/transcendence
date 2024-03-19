import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../utils/types';
import ProfilePicture from '../../ProfilePicture/ProfilePicture';
import AntSwitch from '../SwitchButton/AntSwitch';
import useAuth from '../../../contexts/Auth/useAuth';
import userServices from '../../../services/user';
import OtherProfilePublicInfo from './OtherProfilePublicInfo';
import ReturnButton from '../../Buttons/ButtonReturn/ReturnButton';
import Modal from '../../Modal/Modal';
import RankWinsLosses from './RankWinsLosses';

import '../profile.css';

interface ProfileInformationProps {
  userProfile: User,
  setUserProfile: React.Dispatch<React.SetStateAction<User | null>>,
  isToggled: boolean,
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>,
  handleQrCode: () => Promise<void>,
}

function ProfileInformation({
  userProfile,
  setUserProfile,
  isToggled,
  setIsToggled,
  handleQrCode,
}: ProfileInformationProps) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const isUserIsUserProfile = user.id === userProfile.id; // TODO: state ?
  const [isFriend, setIsFriend] = useState<boolean | undefined>();
  const [isBlocked, setIsBlocked] = useState<boolean | undefined>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState<boolean>(false);
  const [modalInputValue, setModalInputValue] = useState<string>('');

  const hook = () => {
    if (isUserIsUserProfile) setUserProfile(user);
  };
  useEffect(hook, [isUserIsUserProfile, setUserProfile, user]);

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

  const handleAddBlockClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    console.log('oui');
    userServices
      .addBlock(user.id, userProfile.id)
      .then(() => setIsBlocked(true))
      .catch((error) => console.error(error));
  };

  const handleDelBlockClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    userServices
      .deleteBlock(user.id, userProfile.id)
      .then(() => setIsBlocked(false))
      .catch((error) => console.error(error));
  };

  const handleEditPhoto = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsModalVisible(true);
  };

  const handleModalInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setModalInputValue(event.target.value);
  };

  const handleOnSubmitForm = (event: React.SyntheticEvent) => {
    event.preventDefault();

    console.log(`Avatar url: ${user.avatar}.`);
    userServices
      .updateAvatar(user.id, modalInputValue)
      .then((updatedUser) => {
        setUser((prevUser) => ({ ...prevUser, avatar: updatedUser.avatar }));
        setIsModalVisible(false);
        setModalInputValue('');

        console.log(`New avatar url: ${updatedUser.avatar}.`);
      })
      .catch((error) => {
        setIsModalVisible(false);
        setModalInputValue('');

        console.error(error);
      });
  };

  const handleEditLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsLoginModalVisible(true);
  };

  const handleOnSubmitLoginForm = (event: React.SyntheticEvent) => {
    event.preventDefault();

    console.log(`Login: ${user.login}.`);
    userServices
      .updateLogin(user.id, modalInputValue)
      .then((updatedUser) => {
        setUser((prevUser) => ({ ...prevUser, login: updatedUser.login }));
        setIsLoginModalVisible(false);
        setModalInputValue('');

        console.log(`New login: ${updatedUser.login}.`);

        localStorage.setItem('userLogin', updatedUser.login);
        navigate(`/profile/${updatedUser.login}`);
      })
      .catch((error) => {
        setIsLoginModalVisible(false);
        setModalInputValue('');

        console.error(error);
      });
  };

  return (
    <div className="page profile-style">
      {isModalVisible && (
        <Modal
          title="Edit photo"
          placeholder="https://www.exemple.com"
          handleOnSubmitForm={handleOnSubmitForm}
          formValue={modalInputValue}
          HandleFormOnChange={handleModalInputOnChange}
          handleXmarkButtonClick={(
            event: React.MouseEvent<HTMLButtonElement>,
          ) => {
            event.preventDefault();
            setIsModalVisible(false);
            setModalInputValue('');
          }}
        />
      )}
      {isLoginModalVisible && (
        <Modal
          title="Edit login"
          placeholder="new login"
          handleOnSubmitForm={handleOnSubmitLoginForm}
          formValue={modalInputValue}
          HandleFormOnChange={handleModalInputOnChange}
          handleXmarkButtonClick={(
            event: React.MouseEvent<HTMLButtonElement>,
          ) => {
            event.preventDefault();
            setIsLoginModalVisible(false);
            setModalInputValue('');
          }}
        />
      )}

      {!isUserIsUserProfile && <ReturnButton path="/friends" />}

      <div className="picture-container">
        <ProfilePicture size="256px" imageUrl={userProfile.avatar} />
        {isUserIsUserProfile && (
          <button
            className="picture-overlay-background"
            type="button"
            aria-label="Edit photo"
            onClick={handleEditPhoto}
          >
            <div className="picture-overlay-text">Edit photo</div>
          </button>
        )}
      </div>

      <div className={isUserIsUserProfile ? 'login-container' : ''}>
        <h3 style={{ marginLeft: 0, marginBottom: -16 }}>
          {userProfile.login}
        </h3>
        {isUserIsUserProfile && (
          <button
            className="login-overlay"
            type="button"
            aria-label="Edit login"
            onClick={handleEditLogin}
          >
            {' '}
          </button>
        )}
      </div>

      <p>
        {userProfile.firstName}
        {userProfile.lastName}
      </p>

      <RankWinsLosses userProfile={userProfile} />

      {isUserIsUserProfile ? (
        <div className="switch-style">
          <AntSwitch
            isToggled={isToggled}
            onToggle={() => setIsToggled(!isToggled)}
            handleQrCode={handleQrCode}
          />
        </div>
      ) : (
        <OtherProfilePublicInfo
          isFriend={isFriend}
          setIsFriend={setIsFriend}
          isBlocked={isBlocked}
          setIsBlocked={setIsBlocked}
          userProfile={userProfile}
          handleAddFriendClick={handleAddFriendClick}
          handleDelFriendClick={handleDelFriendClick}
          handleAddBlockClick={handleAddBlockClick}
          handleDelBlockClick={handleDelBlockClick}
        />
      )}
    </div>
  );
}

export default ProfileInformation;
