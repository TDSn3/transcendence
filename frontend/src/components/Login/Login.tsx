import Cta from '../Cta/Cta';
import './login.css';

interface LoginProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

const Login = ({ setIsLogin }: LoginProps) => {

  const handleClick = () => {
    const redirect_url = import.meta.env.VITE_APP_42API as string;
    try {
      window.location.href = redirect_url
      setIsLogin(true);
    } catch (error) {
      setIsLogin(false);
      console.log(error);
    }
  };

  return (
    <div className='login'>
      <h3 style={{ marginBottom: '16px', marginLeft: 0 }} >Log in</h3>
      <Cta text='Sign in with 42'handleClick={handleClick} />
    </div>
  );
};

export default Login;
