/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/Auth/useAuth';
import axios from "axios";
import Popup from "./Popup";
import Channel from "./Channel";
import Modal from '../Modal/Modal';
import channelsServices from '../../services/channels';

import "./channels.css";

const Channels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

	const [channelsNames, setChannelsNames] = useState<{id: number, name: string}[]>();
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [channelPassword, setChannelPassword] = useState<string>("");
	const [channelPrivate, setChannelPrivate] = useState<boolean>(false);
	const [isModalVisiblePasswordChannel, setIsModalVisiblePasswordChannel] = useState<boolean>(false);
	const [modalPasswordChannelValue, setModalPasswordChannelValue] = useState<string>('');
	const [selectedChannel, setSelectedChannel] = useState<string>('');

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

		console.log('Try to access to this channel :', selectedChannel);
		setIsModalVisiblePasswordChannel(false);
		setSelectedChannel('');
	  };

	const handleOnChangeModalPasswordChannel = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setModalPasswordChannelValue(event.target.value);
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
					channelsNames?.map((value: any) =>
						<Channel
							key={value.id}
							name={value.name}
							intraId={user.intraId}
							setIsModalVisible={setIsModalVisiblePasswordChannel}
							setSelectedChannel={setSelectedChannel}
						/>
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
