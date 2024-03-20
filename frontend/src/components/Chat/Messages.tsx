import axios from "axios";
import "./chat.css";

interface MessagesProps {
	messages: any,
	blockedUsers: any
}

interface MessageProps {
	channelName: string,
	author: any,
	message: any,
}

export const Message = ({ channelName, author, message }: MessageProps) => {
	console.log(author);
	return (
		<div className="message">
			<a href={`http://localhost:3000/profile/${author.login}`}><img className="profilePicture" src={author.avatar} /></a>
			<div>
				<a href={`http://localhost:3000/profile/${author.login}`} className="username">{author.login}</a>
				<input type="button" value="mute" onClick={() => axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/mute`)} />
				<input type="button" value="ban" onClick={() => axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/ban`)} />
				<input type="button" value="op" onClick={() => axios.patch(`http://localhost:5001/api/channelMembers/${channelName}/${author.intraId}/op`)} />
				<br />
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
						return (<Message key={index} channelName={value.channel.name} author={value.member} message={value.content} />);
					}
					return (<Message channelName={value.channel.name} author={value.member} message={(<strong>[blocked user]</strong>)} />);
				})
			}
		</div>
	);
}
