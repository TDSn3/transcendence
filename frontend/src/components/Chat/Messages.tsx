/* eslint-disable */

import "./chat.css";

interface MessagesProps {
	messages: any,
	blockedUsers: any
}

interface MessageProps {
	username: string,
	avatar: string,
	message: string,
}

export const Message = ({username, avatar, message}: MessageProps) => {
	return (
		<div className="message">
			<a href={`http://localhost:3000/profile/${username}`}><img className="profilePicture" src={avatar} /></a>
			<div>
				<a href={`http://localhost:3000/profile/${username}`} className="username">{username}</a><br />
				{message}
			</div>
		</div>
	);
}

export const Messages = ({ messages, blockedUsers }: MessagesProps) => {
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
						return (<Message key={index} username={value.member.login} avatar={value.member.avatar} message={value.content} />);
					}
					return (null);
				})
			}
		</div>
	);
}
