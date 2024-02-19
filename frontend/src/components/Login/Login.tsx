import React from 'react';
import './Login.css';

function SignIn42(): JSX.Element {
  const handleClick = (event: React.FormEvent): void => {
    event.preventDefault();
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-84904227fc0a4c9b2bf80053ac3a28805d432b0970e0fa40c44ce8f1cb1f5403&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FsignIn42&response_type=code';
  };

  return (
    <div className="login42">
      <h3 style={{ marginBottom: '16px', marginLeft: 0 }}>Log in</h3>
      <button
        className="buttonsubmit42"
        onClick={handleClick}
        type="button"
      >
        {' '}
        login with 42
      </button>
    </div>
  );
}

export default SignIn42;

