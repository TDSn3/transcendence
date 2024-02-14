// signIn42.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';


const SignIn42: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setLoggedIn, setUser } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        console.log('code:', code);

        if (!code) {
            setError('No authorization code found');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/auth/signin42', {
                    params: { code },
                    withCredentials: true,
                });

                if (response.data.user) {
                    const userData: IntraUserData = response.data.user;

                    console.log('User signed in:', userData);

                    setLoggedIn(true);
                    setUser(userData);

                    const nextLocation = '/home';
                    navigate(nextLocation);
                } else {
                    setError('User not found');
                }

            } catch (error) {
                console.error('Error during signin42 request:', error);
            }
        };

        fetchData();
    }, [location.search, navigate, setLoggedIn]);

    return (
        <div>
            <h1>Signing in...</h1>
        </div>
    )
};

export default SignIn42;
