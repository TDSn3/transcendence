import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import GameHistory from './GameHistory/GameHistory';
import { User, emptyUser } from '../../utils/types';
import userServices from '../../services/user';
import typeGuard from '../../utils/typeGuard';
import ProfileInformation from './ProfileInformation/ProfileInformation';
import QrCode from '../QrCode/qrCode';
import useAuth from '../../contexts/Auth/useAuth';
import './profile.css';

function Profile() {
  const { login } = useParams();
  const { user: userData } = useAuth();
  const [popup, setPopup] = useState(false);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(emptyUser);
  const [img, setImg] = useState<string | null>(null);
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

  const handleQrCode = async (): Promise<void> => {
    console.log('userData ', userData);
    console.log('isToggled', isToggled);
    try {
      console.log('userData 34s', userData);
      const resp = await axios.post('http://localhost:5001/api/auth/2fa', {
        userData,
      });
      console.log('isToggledww', isToggled);
      toast.success(
        <b>
          2fa
          {isToggled ? ' Desactive !' : ' Active !'}
        </b>,
      );
      console.log('resp ', resp);
      if (resp.status === 200) {
        const { data } = resp;
        console.log('data resp', resp);
        setImg(data);
        console.log('typo ', typeof data);
        setPopup(true);
      }
      console.log('isToggled33', isToggled);
    } catch (error) {
      console.log('error ', error);
    }
  };

  useEffect(() => {
    console.log('img', img);
    if (userData) setIsToggled(userData.isTwoFactorAuthEnabled);
  }, [img, userData]);

  if (userProfile) {
    return (
      <>
        <ProfileInformation
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          isToggled={isToggled}
          setIsToggled={setIsToggled}
          handleQrCode={handleQrCode}
        />

        <div className="page">
          <h3 className="game-history-title-style">Game History</h3>

          <GameHistory userProfile={userProfile} />
          {popup && img != null && (
            <QrCode onClose={() => setPopup(false)} qrCode={img} />
          )}
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </>
    );
  }

  return <h1>Not found</h1>;
}

export default Profile;
