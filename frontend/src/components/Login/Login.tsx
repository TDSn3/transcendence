import React from 'react';
import Cta from '../Cta/cta';

import './login.css';

function Login() {

  const handleClick42 = (event: React.FormEvent): void => {
    event.preventDefault();

    if (API_42_UID) {
      window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${API_42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A${FRONTEND_PORT}%2FsignIn42&response_type=code`;
    } else {
      console.error('API 42 UID error. Needed on `.env.private` at root.');
    }
  };

  return (
    <div className="login">
      <h3>Log in</h3>
      <Cta
        text="Authenticator"
        srcImg="../../42-BLACK.svg"
        altImg="Sign in with 42"
        handleClick={handleClick42}
      />
    </div>
  );
}

export default Login;
