import Banner from "./Banner.tsx";
import Messages from "./Messages.tsx";
import InputBar from "./InputBar.tsx";
import "./chat.css";
import { Outlet } from "react-router-dom";

interface ChatProps {
	channelName: string,
}

const ChatRender = ({ channelName }: ChatProps) => {
	return (
		<div className="page" id="kekw">
			<Banner channelName={channelName} />
			<Messages />
			<InputBar />
			<Outlet />
		</div>
	);
}

export default ChatRender;
