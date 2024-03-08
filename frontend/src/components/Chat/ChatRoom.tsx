import React, { FormEvent, useState } from 'react';
import Messages from "./Messages.tsx";
import "./chat.css";
import useSocket from "../../contexts/Socket/useSocket.tsx";
import useAuth from '../../contexts/Auth/useAuth.tsx';
import { useParams } from 'react-router-dom';

interface InputBarProps {
	socket: any,
	user: any,
}

const InputBar = ({ socket, user }: InputBarProps) => {
	const [message, setMessage] = useState<string>("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement>  = (e: FormEvent) => {
		e.preventDefault();
		socket.emit("chatSend", { id: user.id, message: message });
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
	const { socket } = useSocket();
	const { user } = useAuth();

	console.log(channelName);
	return (
		<div className="page" id="kekw">
			<div className="banner">
				<h3>{channelName}</h3>
			</div>
			<Messages />
			<InputBar socket={socket} user={user}/>
		</div>
	);
}

export default ChatRoom;
