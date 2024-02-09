import InputBar from "./Chat/InputBar.tsx";
import MessageList from "./Chat/MessageList.tsx";
import "./Chat/chat.css";

const Chat = () =>
{
	return (
		<div className="page" id="kekw">
			<MessageList />
			<InputBar />
		</div>
	);
};

export default Chat;
