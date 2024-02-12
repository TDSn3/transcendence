import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Signin42 = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

                console.log(response.data);
                navigate('/home');
                
            } catch (error) {
                console.error('Error during signin42 request:', error);
            }
        };

        fetchData();
    }, [location.search, navigate]);

    return (
        <div>

        </div>
    );
};

export default Signin42;
