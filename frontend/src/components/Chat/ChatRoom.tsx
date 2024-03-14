import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Messages, Message } from "./Messages.tsx";
import "./chat.css";
import useAuth from '../../contexts/Auth/useAuth.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { checkChannel } from '../../services/channnels.tsx';
import Popup from './Popup.tsx';
import { io } from 'socket.io-client';
import axios from 'axios';

interface InputBarProps {
	socketRef: any,
	user: any,
	channelName: string,
}

const InputBar = ({ socketRef, user, channelName }: InputBarProps) => {
	const [message, setMessage] = useState<string>("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement>  = (e: FormEvent) => {
		e.preventDefault();
		socketRef.current.emit("chatSend", { user: user, channelName: channelName, message: message });
		setMessage("");
	}

	return (
		<form className="input-bar" onSubmit={handleSubmit}>
			<input className="input-text" type="text" autoComplete="off" autoFocus value={message} onChange={(e) => { setMessage(e.target.value); }}/>
			<button className="input-button">Send</button>
		</form>
	);
}

const ChatRoom = () => {
	const { channelName } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const socketRef = useRef<any>(null);
	const [messages, setMessages] = useState([]);
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const [newChannelPassword, setNewChannelPassword] = useState<string>("");
	const [newChannelPrivate, setNewChannelPrivate] = useState<boolean>(false);

	useEffect(() => {
		const channelChecker = async () => {
			if (!(await checkChannel(channelName !== undefined ? channelName : ""))) {
				navigate("/chat");
			}
		}
		const messagesGetter = async () => {
			setMessages((await axios.get(`http://localhost:5001/api/channels/${channelName}/messages`)).data);
		}
		channelChecker();
		messagesGetter();

		socketRef.current = io("http://localhost:5001/chat");
		socketRef.current.emit("chatJoin", {intraId: user.intraId, channelName: channelName});
		socketRef.current.on("chatReceive", (payload: {newMessage: any}) => {
			console.log(payload.newMessage);
			setMessages([...messages, payload.newMessage]);
			// console.log(messages);
		});

		return () => {
			socketRef.current.disconnect();
		}
	}, []);

	const handleSubmit: any = (e: any) => {
		e.preventDefault();
	}

	return (
		<div className="page" id="kekw">
			<div className="banner">
				<input type="button" value="←" onClick={() => navigate("/chat")}/>
				<h3>{channelName}</h3>
				<input type="button" value="⚙️" onClick={() => setButtonPopup(!buttonPopup)}/>
			</div>
			<Messages messages={messages}/>
			<InputBar socketRef={socketRef} user={user} channelName={channelName !== undefined ? channelName : ""}/>
			<Popup className="option" trigger={buttonPopup} setTrigger={setButtonPopup} x="30px" y="75px">
				<h4 className="option-title">Channel option</h4>
				<form className="option-form" onSubmit={handleSubmit}>
					<input type="text" placeholder="New password" value={newChannelPassword} onChange={(e) => {setNewChannelPassword(e.target.value)}}/>
					<div className="option-form-end">
						Private: <input type="checkbox" onChange={() => setNewChannelPrivate(!newChannelPrivate)}/>
						<input type="button" value="Update" onClick={handleSubmit}/>
					</div>
				</form>
			</Popup>
		</div>
	);
}

export default ChatRoom;
