import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useSocket from "../../contexts/Socket/useSocket.tsx";
import useAuth from '../../contexts/Auth/useAuth.tsx';
import axios from "axios";
import Popup from "./Popup.tsx";
import "./channels.css";

interface ChannelProps {
	id: number,
	name: string,
	socket: any,
	user: any,
}

const channelsNames = (await axios.get("http://localhost:5001/api/channels/names")).data

const Channel = ({ id, name, socket, user }: ChannelProps) => {
	const navigate = useNavigate();

	const handleClick: any = () => {
		socket.emit("chatJoin", { intraId: user.intraId, channelId: id });
		navigate("/chat/" + name);
		// axios.post("http://localhost:5001/api/channelMembers", { intraId: user.intraId, channelId: id });
	}

	return (
		<div className="channel">
			<input type="button" value={name} onClick={handleClick}/>
		</div>
	);
}

const Channels = () => {
	const { socket } = useSocket();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>("");
	const [channelPassword, setChannelPassword] = useState<string>("");
	const [channelPrivate, setChannelPrivate] = useState<boolean>(false);

	const handleSubmit: any = (e: any) => {
		e.preventDefault();
		axios.post("http://localhost:5001/api/channels", {intraId: user.intraId, name: channelName, password: channelPassword, private: channelPrivate})
			.then(() => {
				navigate("/chat/" + channelName);
				window.location.reload();
			})
			.catch(() => {
				console.log("problemz");
			});
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
					channelsNames.map((value: any) =>
						<Channel key={value.id} id={value.id} name={value.name} socket={socket} user={user}/>
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
