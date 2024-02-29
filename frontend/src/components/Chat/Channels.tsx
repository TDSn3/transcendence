import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup.tsx";
import "./channels.css";

import { useNavigate } from 'react-router-dom';

const channelsNames = (await axios.get("http://localhost:5001/api/channels/names")).data;

// ptet utiliser des navigate a la place des Link ?
const Channel = ({name}: any) => {
	return (
		<div className="channel">
			<Link to={name}>
				<input type="button" value={name}/>
			</Link>
		</div>
	);
}

const Channels = () => {
	const navigate = useNavigate();

	console.log("pouet,", channelsNames);

	const [buttonPopup, setButtonPopup] = useState(false);
	const [channelName, setChannelName] = useState("");
	const [channelPassword, setChannelPassword] = useState("");
	const [channelPrivate, setChannelPrivate] = useState(false);

	const handleSubmit: any = (e: any) => {
		const { setLoggedIn, user, setUser } = useAuth();
		e.preventDefault();
		if (channelName.length === 0 || channelName.includes(" ") || channelPassword.includes(" ")) {
			console.log("your channel name or channel password is not valid !");
			setChannelName("");
			setChannelPassword("");
			setChannelPrivate(false);
		} else {
			axios.post("http://localhost:5001/api/channels", {name: channelName, password: channelPassword, private: channelPrivate})
				.then(() => {
					navigate("/chat/" + channelName);
				}
			);
		}
	}

	return (
		<div>
			<div className="banner">
				<input type="button" value="🏠" onClick={() => navigate("/home")}/>
				<h3>Chat</h3>
				<input type="button" value="+" onClick={() => setButtonPopup(!buttonPopup)}/>
			</div>
			<div className="channels">
				{
					channelsNames.map((value: any) =>
						<Channel key={value.name} name={value.name}/>
					)
				}
			</div>
			<Popup className="create" trigger={buttonPopup} setTrigger={setButtonPopup}>
				<h4 className="create-title">Channel creation</h4>
				<form className="create-form" onSubmit={handleSubmit}>
					<input type="text" placeholder="Name" autoComplete="off" value={channelName} onChange={(e) => {setChannelName(e.target.value)}}/>
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
