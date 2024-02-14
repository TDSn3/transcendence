// Login.tsx
import './login.css';

const Login: React.FC = (): JSX.Element => {

  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();
    // const redirect_url = import.meta.env.VITE_APP_42API;
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-84904227fc0a4c9b2bf80053ac3a28805d432b0970e0fa40c44ce8f1cb1f5403&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FsignIn42&response_type=code';
  }

  return (
    <div className='42button'>
      Log in 
      <button
        className="42buttonsubmit" onClick={handleClick}
      > login with 42
      </button>
    </div>
  );
};

export default Login;
