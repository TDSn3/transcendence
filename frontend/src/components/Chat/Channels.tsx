import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { decodeToken } from "react-jwt";
import axios from "axios";
import Popup from "./Popup.tsx";
import "./channels.css";


const channelsNames = (await axios.get("http://localhost:5001/api/channels/names")).data;


const Channel = ({name}: any) => {
	const navigate = useNavigate();

	const handleClick: any = (name: string) => {
		console.log(name);
		// axios.put("http://localhost:5001/api/channels/" + name, {})
		// 	.then(() => {
		// 		navigate("/chat/" + name);
		// 	});
	}

	return (
		<div className="channel">
			{/* <input type="button" value={name} onClick={handleClick(name)}/> */}
			<button onClick={handleClick(name)}>{name}</button>
		</div>
	);
}

const Channels = () => {
	const navigate = useNavigate();

	const [buttonPopup, setButtonPopup] = useState(false);
	const [channelName, setChannelName] = useState("");
	const [channelPassword, setChannelPassword] = useState("");
	const [channelPrivate, setChannelPrivate] = useState(false);

	const handleSubmit: any = (e: any) => {
		e.preventDefault();
		if (channelName.length === 0 || channelName.includes(" ") || channelPassword.includes(" ")) {
			console.log("your channel name or channel password is not valid !");
			setChannelName("");
			setChannelPassword("");
			setChannelPrivate(false);
		} else {
			axios.post("http://localhost:5001/api/channels", {intraId: (decodeToken(document.cookie).sub), name: channelName, password: channelPassword, private: channelPrivate})
				.then(() => {
					navigate("/chat/" + channelName);
					window.location.reload();
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
