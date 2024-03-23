import axios from "axios";
import "./chat.css";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../contexts/Auth/useAuth";

interface MessagesProps {
	messages: any,
	blockedUsers: any
}

interface MessageProps {
	channelName: string,
	author: any,
	message: any
}

interface MessageButtonsProps {
	channelName: string,
	author: any,
	userIntraId: number,
	isUserOwner: boolean
}

const MessageButtons = ({ channelName, author, userIntraId, isUserOwner }: MessageButtonsProps) => {
	const isOwnerRef = useRef<boolean>(false);
	const [isBan, setBan] = useState<boolean>(false);
	const [isAdmin, setAdmin] = useState<boolean>(false);
	useEffect(() => {
		const fetchData = async () => {
			const response = (await axios.get(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}`)).data;
			setBan(response.isBan);
			setAdmin(response.isAdmin);
			isOwnerRef.current = response.isOwner;
		}
		fetchData();
	}, []);

	const handleMuteClick = async () => {
		await axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/mute`, { intraId: userIntraId });
	}
	const handleBanClick = async () => {
		setBan((await axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/ban`, { intraId: userIntraId })).data);
	}
	const handleKickClick = async () => {
		await axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/kick`, { intraId: userIntraId });
	}
	const handleAdminClick = async () => {
		setAdmin((await axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/op`, { intraId: userIntraId })).data);
	}
	return (
		<>
			{ !isAdmin && <input className="message-btn" type="button" value="mute" onClick={handleMuteClick} /> }
			{ !isAdmin && <input className="message-btn" type="button" value={isBan ? "un-Ban" : "ban"} onClick={handleBanClick} /> }
			{ !isAdmin && <input className="message-btn" type="button" value="kick" onClick={handleKickClick} /> }
			{ isUserOwner && !isOwnerRef.current && <input className="message-btn" type="button" value={isAdmin ? "un-op" : "op"} onClick={handleAdminClick} /> }
		</>
	);
}

const Message = ({ channelName, author, message }: MessageProps) => {
	const { user } = useAuth();

	const isAdminRef = useRef<boolean>(false);
	const isOwnerRef = useRef<boolean>(false);
	const [isMouseOver, setMouseOver] = useState<boolean>(false);
	useEffect(() => {
		const fetchData = async () => {
			const response = (await axios.get(`http://localhost:5001/api/channelMembers/${channelName}/${user.intraId}`)).data;
			isAdminRef.current = response.isAdmin;
			isOwnerRef.current = response.isOwner;
		}
		fetchData();
	}, []);

	return (
		<div className="message" onMouseOver={() => setMouseOver(true)} onMouseOut={() => setMouseOver(false)}>
			<a href={`http://localhost:3000/profile/${author.login}`}><img className="profilePicture" src={author.avatar} /></a>
			<div>
				<a href={`http://localhost:3000/profile/${author.login}`} className="username">{author.login}</a>
				{
					!isMouseOver || !isAdminRef.current ? "" : <MessageButtons channelName={channelName} author={author} userIntraId={user.intraId} isUserOwner={isOwnerRef.current} />
				}
				<br />
				{message}
			</div>
		</div>
	);
}

const Messages = ({ messages, blockedUsers }: MessagesProps) => {
	const isIn = (users: any, userToFind: any): boolean => {
		for (const user of users) {
			if (user.intraId === userToFind.intraId) {
				return (true);
			}
		}
		return (false);
	}

	return (
		<div className="messages">
			{
				messages.map((value: any, index: number) => {
					if (!isIn(blockedUsers, value.member)) {
						return (<Message key={index} channelName={value.channel.name} author={value.member} message={value.content}/>);
					}
					return (<Message channelName={value.channel.name} author={value.member} message={(<strong>[blocked user]</strong>)}/>);
				})
			}
		</div>
	);
}

export default Messages;
