import "./chat.css";

export interface MessageType {
	username: string,
	profilePictureUrl: string,
	message: string,
}

export const Message = ({username, profilePictureUrl, message}: MessageType) => {
	const userlink: string = "http://localhost:3001/profile=" + {username};
	return (
		<li id="message">
			<a href={userlink}><img id="profilePicture" src={profilePictureUrl} /></a>
			<div>
				<a href={userlink} id="username">{username}</a><br />
				{message}
			</div>
		</li>
	);
}
