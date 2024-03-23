/* eslint-disable */

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/Auth/useAuth.tsx';
import axios from "axios";
import Popup from "./Popup.tsx";
import "./channels.css";

interface ChannelProps {
	id: number,
	name: string,
	intraId: number,
}

const Channel = ({ id, name, intraId }: ChannelProps) => {
	const navigate = useNavigate();

	const handleClick: any = async () => {
		await axios.post("http://localhost:5001/api/channelMembers", { intraId: intraId, channelId: id });
		navigate("/chat/" + name);
	}

	return (
		<div className="channel">
			<input type="button" value={name} onClick={handleClick}/>
		</div>
	);
}

const Channels = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [channelsNames, setChannelsNames] = useState<{id: number, name: string}[]>();
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [channelPassword, setChannelPassword] = useState<string>("");
	const [channelPrivate, setChannelPrivate] = useState<boolean>(false);

	useEffect(() => {
		const channelsNamesGetter = async () => {
			setChannelsNames((await axios.get("http://localhost:5001/api/channels/names")).data);
		}
		channelsNamesGetter();
	}, []);

	const handleSubmit: any = (e: any) => {
		e.preventDefault();
		if (/^[a-zA-Z]+$/.test(channelName)) {
			axios.post("http://localhost:5001/api/channels", { intraId: user.intraId, name: channelName, password: channelPassword, private: channelPrivate })
				.then(() => {
					navigate("/chat/" + channelName);
				})
				.catch(() => {
					console.log("channelName is not valid");
				}
			);
		}
		setChannelName("");
		setChannelPassword("");
		setChannelPrivate(false);
	}

	return (
		<div id="kekw" className="page">
			<div className="banner">
				<input type="button" value="🏠" onClick={() => navigate("/home")}/>
				<h3>Chat</h3>
				<input type="button" value="+" onClick={() => setButtonPopup(!buttonPopup)}/>
			</div>
			<div className="channels">
				{
					channelsNames?.map((value: any) =>
						<Channel key={value.id} id={value.id} name={value.name} intraId={user.intraId}/>
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
