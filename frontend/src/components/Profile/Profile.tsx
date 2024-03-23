import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import GameHistory from './GameHistory/GameHistory';
import ProfileInformation from './ProfileInformation/ProfileInformation';
import QrCode from '../QrCode/qrCode';
import useAuth from '../../contexts/Auth/useAuth';
import './profile.css';

function Profile() {
  const { user: userData, updateAuthStatus } = useAuth();
  const [popup, setPopup] = useState(false);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [img, setImg] = useState<string | null>(null);

  const handleQrCode = async (): Promise<void> => {
    try {
      const resp = await axios.post('http://localhost:5001/api/auth/2fa', {
        userData,
      });
      updateAuthStatus();
      toast.success(
        <b>
          2fa
          {isToggled ? ' Desactive !' : ' Active !'}
        </b>,
      );
      console.log('resp ', resp);
      if (resp.status === 200) {
        const { data } = resp;
        setImg(data);
        setPopup(true);
      }
    } catch (error) {
      console.log('error ', error);
    }
  };

  useEffect(() => {
    if (userData) setIsToggled(userData.isTwoFactorAuthEnabled);
  }, [userData]);

  if (userData) {
    return (
      <>
        <ProfileInformation
          userProfile={userData}
          // setUserProfile={userData}
          isToggled={isToggled}
          setIsToggled={setIsToggled}
          handleQrCode={handleQrCode}
        />

        <div className="page">
          <h3 className="game-history-title-style">Game History</h3>

          <GameHistory userProfile={userData} />
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
