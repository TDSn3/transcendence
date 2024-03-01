import Messages from "./Messages.tsx";
import InputBar from "./InputBar.tsx";
import "./chat.css";

interface ChatProps {
	channelName: string,
}

const ChatRoom = ({ channelName }: ChatProps) => {
	return (
		<div className="page" id="kekw">
			<div className="banner">
				<h3>{channelName}</h3>
			</div>
			<Messages />
			<InputBar />
		</div>
	);
}

export default ChatRoom;
