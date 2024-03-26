import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../contexts/Auth/useAuth';
import authServices from '../../services/auth';
import { UserStatus } from '../../utils/types';

function SignIn42(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setLoggedIn } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');

    if (!code) navigate('/login');

    const fetchData = async () => {
      try {
        const user = await authServices.authentication42(code as string);

        setUser({ ...user, status: UserStatus.ONLINE });
        if (user.isTwoFactorAuthEnabled) navigate('/login/twofa');
        else {
          setLoggedIn(true);
          navigate(`/profile/${user.login}`);
        }
      } catch (error) {
        setLoggedIn(false);
        console.error(error);
      }
    };

    fetchData();
  }, [location.search, navigate, setLoggedIn, setUser]);

  return <div> </div>;
}

export default SignIn42;
