/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/Auth/useAuth';
import axios from "axios";
import Popup from "./Popup";
import Modal from '../Modal/Modal';
import channelsServices from '../../services/channels';
import { ChannelType } from '../../utils/types';

import "./channels.css";
import './channel.css';

const Channels = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [channelsNames, setChannelsNames] = useState<ChannelType[]>();
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [channelPassword, setChannelPassword] = useState<string>("");
	const [channelPrivate, setChannelPrivate] = useState<boolean>(false);

	const [selectedChannel, setSelectedChannel] = useState<ChannelType>();
	const [isModalVisiblePasswordChannel, setIsModalVisiblePasswordChannel] = useState<boolean>(false);
	const [modalPasswordChannelValue, setModalPasswordChannelValue] = useState<string>('');

	const hook = () => {
		if (!user || !user.id) {
			console.error('Auth context hook not yet !');
			return;
		}
		
		channelsServices
			.getAll(user)
			.then((allChannelsValue) => setChannelsNames(allChannelsValue))
			.catch((error) => console.error(error));
	};
	useEffect(hook, [user]);

	const handleSubmit: any = (e: any) => {
		e.preventDefault();
		if (/^[a-zA-Z]+$/.test(channelName)) {
			axios.post("http://localhost:5001/api/channels", { intraId: user.intraId, name: channelName, password: channelPassword, private: channelPrivate })
				.then(() => {
					navigate("/chat/" + channelName);
				})
				.catch(() => {
					console.log("channelName is not valid");
				});
		}
		setChannelName("");
		setChannelPassword("");
		setChannelPrivate(false);
	}

	const handleOnSubmitPasswordChannel = (event: React.SyntheticEvent) => {
		event.preventDefault();

		if (selectedChannel)
		{
			console.log('Try to access to this channel :', selectedChannel);
			
			if (selectedChannel.password === modalPasswordChannelValue)
			{
				console.log('%cRight password', 'color: green;')

				axios
					.post('http://localhost:5001/api/channelMembers', { intraId: user.intraId, channelName: selectedChannel.name })
					.then(() => {
						setSelectedChannel(undefined);
						setIsModalVisiblePasswordChannel(false);
						setModalPasswordChannelValue('');

						navigate(`/chat/${selectedChannel.name}`)
					});
			} else {
				console.log('%cWrong password', 'color: red;')
			}
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

	const handleClick = (channelData: ChannelType) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (!channelData.password || channelData.password === '') {
			axios
				.post('http://localhost:5001/api/channelMembers', { intraId: user.intraId, channelName: channelData.name })
				.then(() => {
					setSelectedChannel(undefined);
					setIsModalVisiblePasswordChannel(false);
					setModalPasswordChannelValue('');
		
					navigate(`/chat/${channelData.name}`);
				});
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
				<input type="button" value="🏠" onClick={() => navigate("/home")}/>
				<h3>Chat</h3>
				<input type="button" value="+" onClick={() => setButtonPopup(!buttonPopup)}/>
			</div>
			<div className="channels">
				{
					channelsNames?.map((value) =>
						<button key={value.id} className="channel" type="button" onClick={handleClick(value)}>
							{value.name}
					 	</button>
					)
				}
			</div>
			<Popup className="create" trigger={buttonPopup} setTrigger={setButtonPopup} x="30px" y="75px">
				<h4 className="create-title">Channel creation</h4>
				<form className="create-form" onSubmit={handleSubmit}>
					<input type="text" placeholder="Name" autoComplete="off" autoFocus value={channelName} onChange={(e) => {setChannelName(e.target.value)}}/>
					<input type="text" placeholder="Password" autoComplete="off" value={channelPassword} onChange={(e) => {setChannelPassword(e.target.value)}}/>
					<div className="create-form-end">
						Private: <input type="checkbox" onChange={() => {setChannelPrivate(!channelPrivate)}}/>
						<input type="button" value="Send" onClick={handleSubmit}/>
					</div>
				</form>
			</Popup>
		</div>
	);
}

export default Channels;
