/* eslint-disable */

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Messages from "./Messages.tsx";
import "./chat.css";
import useAuth from '../../contexts/Auth/useAuth.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from './Popup.tsx';
import { io } from 'socket.io-client';
import axios from 'axios';

interface InputBarProps {
	socketRef: any,
	user: any,
	channelName: string,
}

interface MemberInfo {
	login: string,
	avatar: string
}

interface MessageInfo {
	id: number,
	createdAt: any,
	userId: number,
	channelId: number,
	content: string,
	member: MemberInfo
}


const InputBar = ({ socketRef, user, channelName }: InputBarProps) => {
	const [message, setMessage] = useState<string>("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement>  = (e: FormEvent) => {
		e.preventDefault();
		if (/\S/.test(message)) {
			socketRef.current.emit("chatSend", { user: user, channelName: channelName, message: message });
			setMessage("");
		}
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
	const blockedUsersRef = useRef<any[]>([]);
	const [messages, setMessages] = useState<any[]>([]);
	const [buttonPopup, setButtonPopup] = useState<boolean>(false);
	const [newChannelPassword, setNewChannelPassword] = useState<string>("");
	const [newChannelPrivate, setNewChannelPrivate] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			if ((await axios.get<boolean>(`http://localhost:5001/api/channels/${channelName}/${user.intraId}/check`)).data) {
				navigate("/chat");
			}
			blockedUsersRef.current = (await axios.get(`http://localhost:5001/api/users/${user.id}/blocked`)).data;
			setMessages((await axios.get(`http://localhost:5001/api/channels/${channelName}/messages`)).data);
		};
		fetchData();

		socketRef.current = io("http://localhost:5001/chat");
		socketRef.current.emit("chatJoin", {intraId: user.intraId, channelName: channelName});
		socketRef.current.on("chatReceive", (payload: { newMessage: MessageInfo }) => {
			setMessages(prevMessages => [...prevMessages, payload.newMessage]);
		});
		socketRef.current.on("chatKick", (payload: { intraIdToKick: number }) => {
			if (payload.intraIdToKick === user.intraId) {
				navigate("/chat");
			}
		});

		return () => {
			socketRef.current.disconnect();
		}
	}, [user]);

	const handleSubmit: any = (e: any) => {
		e.preventDefault();
		axios.patch(`http://localhost:5001/api/channels/${channelName}/update`, { intraId: user.intraId, newPassword: newChannelPassword, newPrivate: newChannelPrivate });
		setButtonPopup(false);
	}

	return (
		<div className="page">
			<div className="banner">
				<input type="button" value="←" onClick={() => navigate("/chat")}/>
				<h3>{channelName}</h3>
				{/* !memberRef.current || !memberRef.current.isOwner ? "" : */}
				{
					<input type="button" value="⚙️" onClick={() => setButtonPopup(!buttonPopup)}/>
				}
			</div>
			<Messages userSocketRef={socketRef} messages={messages} blockedUsers={blockedUsersRef.current}/>
			<InputBar socketRef={socketRef} user={user} channelName={channelName !== undefined ? channelName : ""}/>
			<Popup className="option" trigger={buttonPopup} setTrigger={setButtonPopup} x="30px" y="75px">
				<h4 className="option-title">Channel option</h4>
				<form className="option-form" onSubmit={handleSubmit}>
					<input type="text" placeholder="New password" value={newChannelPassword} onChange={(e) => {setNewChannelPassword(e.target.value)}}/>
					<div className="option-form-end">
						Private: <input type="checkbox" checked={newChannelPrivate} onChange={() => setNewChannelPrivate(!newChannelPrivate)}/>
						<input type="button" value="Update" onClick={handleSubmit}/>
					</div>
				</form>
			</Popup>
		</div>
	);
}

export default ChatRoom;
