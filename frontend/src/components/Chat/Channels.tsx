/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Channel from './Channel.tsx';
import useAuth from '../../contexts/Auth/useAuth.tsx';
import axios from 'axios';
import Popup from './Popup.tsx';
import './channels.css';

const Channels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channelsNames, setChannelsNames] =
    useState<{ id: number; name: string }[]>();
  const [buttonPopup, setButtonPopup] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>('');
  const [channelPassword, setChannelPassword] = useState<string>('');
  const [channelPrivate, setChannelPrivate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log('user.intraId:', user.intraId);
      const data = (
        await axios.get('http://localhost:5001/api/channels/names', {
          params: {
            // Assurez-vous d'utiliser l'option `params` pour passer des paramètres de requête
            intraId: user.intraId,
          },
        })
      ).data;
      console.log('data channel', data);
      setChannelsNames(data);
    };
    fetchData();
  }, [user.intraId]); // Ajoutez `user.intraId` comme dépendance si `user` est susceptible de changer

  const handleSubmit: any = (e: any) => {
    e.preventDefault();
    if (/^[a-zA-Z]+$/.test(channelName)) {
      axios
        .post('http://localhost:5001/api/channels', {
          intraId: user.intraId,
          name: channelName,
          password: channelPassword,
          private: channelPrivate,
        })
        .then(() => {
          navigate('/chat/' + channelName);
        })
        .catch(() => {
          console.log('channelName is not valid');
        });
    }
    setChannelName('');
    setChannelPassword('');
    setChannelPrivate(false);
  };

  return (
    <div id="kekw" className="page">
      <div className="banner">
        <input type="button" value="🏠" onClick={() => navigate('/home')} />
        <h3>Chat</h3>
        <input
          type="button"
          value="+"
          onClick={() => setButtonPopup(!buttonPopup)}
        />
      </div>
      <div className="channels">
        {channelsNames?.map((value: any) => (
          <Channel key={value.id} name={value.name} intraId={user.intraId} />
        ))}
      </div>
      <Popup
        className="create"
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        x="30px"
        y="75px"
      >
        <h4 className="create-title">Channel creation</h4>
        <form className="create-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            autoComplete="off"
            autoFocus
            value={channelName}
            onChange={(e) => {
              setChannelName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Password"
            autoComplete="off"
            value={channelPassword}
            onChange={(e) => {
              setChannelPassword(e.target.value);
            }}
          />
          <div className="create-form-end">
            Private:{' '}
            <input
              type="checkbox"
              onChange={() => {
                setChannelPrivate(!channelPrivate);
              }}
            />
            <input type="button" value="Send" onClick={handleSubmit} />
          </div>
        </form>
      </Popup>
    </div>
  );
};

export default Channels;
