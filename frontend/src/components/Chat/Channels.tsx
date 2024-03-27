/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/Auth/useAuth';
import Popup from './Popup';
import Modal from '../Modal/Modal';
import channelsServices from '../../services/channels';
import { ChannelType } from '../../utils/types';
import { IoMdLogOut } from 'react-icons/io';
import './channels.css';
import './channel.css';
import toast, { Toaster } from 'react-hot-toast';

const Channels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channelsNames, setChannelsNames] = useState<ChannelType[]>();
  const [buttonPopup, setButtonPopup] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>('');
  const [channelPassword, setChannelPassword] = useState<string>('');
  const [channelPrivate, setChannelPrivate] = useState<boolean>(false);
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState<boolean>(false);

  const [selectedChannel, setSelectedChannel] = useState<ChannelType>();
  const [isModalVisiblePasswordChannel, setIsModalVisiblePasswordChannel] =
    useState<boolean>(false);
  const [modalPasswordChannelValue, setModalPasswordChannelValue] =
    useState<string>('');

  const hook = () => {
    if (!user || !user.id) {
      console.error('Auth context hook not yet !');
      return;
    }

    channelsServices
      .getAll(user)
      .then((allChannelsValue) => setChannelsNames(allChannelsValue))
      .catch((error) => console.error(error));
    console.log('channelsNames.', channelsNames);
  };
  useEffect(hook, [user]);

  const handleSubmit: any = (e: any) => {
    e.preventDefault();

    if (/^[a-zA-Z]+$/.test(channelName)) {
      channelsServices
        .addChannel({
          intraId: user.intraId,
          name: channelName,
          password: channelPassword,
          private: channelPrivate,
        })
        .then(() => {
          navigate('/chat/' + channelName);
        })
        .catch(() => toast.error(<b>failed addition of chatRoom</b>));
    }

    setChannelName('');
    setChannelPassword('');
    setChannelPrivate(false);
  };

  useEffect(() => {
    if (channelsNames) {
      setIsOwnerOrAdmin(
        channelsNames.some(
          (channel) =>
            channel.members.some((member) => member.userId === user.intraId) &&
            (channel.members.find((member) => member.userId === user.intraId)
              ?.isAdmin ||
              channel.members.find((member) => member.userId === user.intraId)
                ?.isOwner),
        ),
      );
    }
  }, [channelsNames, user.intraId]);

  const handleIsOwnerOrAdmin = (channel: ChannelType): boolean => {
    console.log(
      '333:',
      channel.members.some(
        (member: any) => member.userId === user.intraId && member.isAdmin,
      ),
    );
    console.log('channel:', channel);
    return channel.members.some(
      (member: any) => member.userId === user.intraId && member.isAdmin,
    );
  };

  useEffect(() => {
    console.log('isOwnerOrAdmin:', isOwnerOrAdmin);
  }, [isOwnerOrAdmin]);

  const handleOnSubmitPasswordChannel = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (selectedChannel) {
      console.log('Try to access to this channel :', selectedChannel);
      console.log('modalPasswordChannelValue:', modalPasswordChannelValue);
      channelsServices
        .addChannelMembers({
          intraId: user.intraId,
          name: selectedChannel.name,
          password: modalPasswordChannelValue,
        })
        .then((object) => {
          if ('message' in object) {
            console.log('%cWrong password', 'color: red;');
          } else {
            console.log('%cRight password', 'color: green;');

            setSelectedChannel(undefined);
            setIsModalVisiblePasswordChannel(false);
            setModalPasswordChannelValue('');

            navigate(`/chat/${selectedChannel.name}`);
          }
        })
        .catch((error) => console.error(error));
    }

    setSelectedChannel(undefined);
    setIsModalVisiblePasswordChannel(false);
    setModalPasswordChannelValue('');
  };

  const handleOnChangeModalPasswordChannel = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setModalPasswordChannelValue(event.target.value);
  };

  const handleLeave = async (channelName: string) => {
    try {
      await channelsServices.removeChannelMember(channelName, user.intraId);
      toast.success('Channel successfully left');
    } catch (error) {
      console.error(error);
    }
  };
  const handleClick =
    (channelData: ChannelType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!channelData.password || channelData.password === '') {
        channelsServices
          .addChannelMembers({ intraId: user.intraId, name: channelData.name })
          .then(() => {
            setSelectedChannel(undefined);
            setIsModalVisiblePasswordChannel(false);
            setModalPasswordChannelValue('');

            navigate(`/chat/${channelData.name}`);
          })
          .catch((error) => console.error(error));
      } else {
        setSelectedChannel(channelData);
        setIsModalVisiblePasswordChannel(true);
      }
    };

  return (
    <div className="page">
      {isModalVisiblePasswordChannel && (
        <Modal
          title="Password"
          placeholder="Enter your password"
          handleOnSubmitForm={handleOnSubmitPasswordChannel}
          formValue={modalPasswordChannelValue}
          HandleFormOnChange={handleOnChangeModalPasswordChannel}
          handleXmarkButtonClick={(
            event: React.MouseEvent<HTMLButtonElement>,
          ) => {
            event.preventDefault();
            setIsModalVisiblePasswordChannel(false);
            setModalPasswordChannelValue('');
          }}
        />
      )}

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
        {channelsNames?.map((value, index) => (
          <div key={index} className="channelsContainer">
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <button
                key={value.id}
                className="channel"
                type="button"
                onClick={handleClick(value)}
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {value.name}
              </button>
              {!value.isDual && !handleIsOwnerOrAdmin(value) && (
                <button
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                  onClick={() => handleLeave(value.name)}
                >
                  <IoMdLogOut size={30} color="red" />
                </button>
              )}
            </div>
          </div>
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Channels;
