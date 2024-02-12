import { URLSearchParams } from 'url';
import './login.css';


const Login: React.FC = (): JSX.Element => {

  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();
    const redirect_url = import.meta.env.VITE_APP_42API as string;
    window.location.href = redirect_url;

  };

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
