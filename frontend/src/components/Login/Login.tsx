import Cta from '../Cta/Cta';
import './login.css';

interface LoginProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

const Login = ({ setIsLogin }: LoginProps) => {

  const handleClick = () => {
    setIsLogin(true);
  };

  return (
    <div className='login'>
      <h3 style={{ marginBottom: '16px', marginLeft: 0 }} >Log in</h3>
      <Cta text='Sign in with 42'handleClick={handleClick} />
    </div>
  );
};

export default Login;
