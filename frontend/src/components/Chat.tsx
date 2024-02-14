import Channels from "./Chat/Channels.tsx";

import Banner from "./Chat/Banner.tsx";
import Messages from "./Chat/Messages.tsx";
import InputBar from "./Chat/InputBar.tsx";
import "./Chat/chat.css";

const Chat = () =>
{
	return (
		<div className="page" id="kekw">
			<Channels />
			{/* <Banner channelName="Coucou" />
			<Messages />
			<InputBar /> */}
		</div>
	);
};

export default Chat;
