import Banner from "./Banner.tsx";
import Messages from "./Messages.tsx";
import InputBar from "./InputBar.tsx";
import "./chat.css";

interface ChatProps {
	channelName: string,
}

const ChatRender = ({ channelName }: ChatProps) => {
	return (
		<div className="page" id="kekw">
			<Banner channelName={channelName} />
			<Messages />
			<InputBar />
		</div>
	);
}

export default ChatRender;
