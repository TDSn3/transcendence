import styled from 'styled-components';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../contexts/Auth/useAuth';

const FormCardTitle = styled.p`
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
  margin-top: 0.2rem;
`;

const FormCardPrompt = styled.p`
  margin-bottom: 2rem;
  font-size: 14px;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 50px;
`;

const FormCardInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const FormCardInput = styled.input`
  display: flex;
  justify-content: center;
  width: 250px;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2rem;
  text-align: start;
  position: absolute;
  z-index: 3;
  border: none;
  background-color: transparent;
  background-color: rgba(206, 206, 206, 0.664);
  border-radius: 12px;
  border: none;
  padding: 0.5rem 1rem;
  &:focus {
    outline: none;
  }
  &::placeholder {
    text-align: center;
  }
`;

const FormCardSubmit = styled.button`
  display: flex;
  width: 180px;
  margin: auto;
  color: white;
  border: none;
  background-color: #212121;
  font-size: 1.2rem;
  border-radius: 0.8rem;
  padding: 0.8rem 3.5rem;
  bottom: 2rem;
  left: 0;
  right: 0;
  transition: 200ms ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    opacity: 0.9;
    transform: scale(95%);
  }
`;
export const InputGroup = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px 40px 20px 40px;
  border-radius: 43px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  font-family: 'Inter', sans-serif;
`;

// Votre composant de formulaire React
function TwoFaAuth() {
  const [OTP, setOTP] = useState<string | null>(null);
  const { user, setLoggedIn } = useAuth();
  const navigate = useNavigate();

  async function HandleSumit(
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<string | undefined> {
    e.preventDefault();
    if (!OTP) return toast.error(<b>OTP invalid 2</b>);
    try {
      console.log('otp send', OTP);
      const resp = await axios.post(
        'http://localhost:5001/api/auth/verify-2fa',
        {
          code: OTP,
          user,
        },
      );
      console.log('resp', resp);
      toast.success(<b>OTP valid</b>, {
        duration: 700,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      setLoggedIn(true);
      navigate(`/profile/${user.login}`);
    } catch (err) {
      toast.error(<b>OTP invalid</b>);
      console.log(err);
    }
  }

  return (
    <Container>
      <InputGroup>
        <FormCardTitle>Google Authentificator</FormCardTitle>
        <FormCardPrompt>
          Pour vous connecter entrez les 6 chiffres
        </FormCardPrompt>
        <FormCardInputWrapper>
          <FormCardInput
            placeholder="______"
            maxLength={6}
            onChange={(e) => setOTP(e.target.value)}
            value={OTP || ''}
          />
        </FormCardInputWrapper>
        <FormCardSubmit onClick={(e) => HandleSumit(e)}>Submit</FormCardSubmit>
      </InputGroup>
      <Toaster position="top-center" reverseOrder={false} />
    </Container>
  );
}

export default TwoFaAuth;
