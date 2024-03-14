import "./chat.css";

interface MessagesProps {
	messages: any
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

export const Messages = ({ messages }: MessagesProps) => {
	console.log(messages);
	return (
		<div className="messages">
			{
				messages.map((value: any, index: number) => (
					<Message key={index} username={value.member.login} avatar={value.member.avatar} message={value.content} />
				))
			}
		</div>
	);
}
