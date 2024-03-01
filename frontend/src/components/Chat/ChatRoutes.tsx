import { Route } from 'react-router-dom';
import ChatRoom from "./ChatRoom.tsx";

const channels = ['General', 'oui', 'Coucou', 'bob', 'suuuuuuu'];

const ChatRoutes = () => {
	return (
		channels.map((channel) => (
			<Route key={channel} path={"/chat/" + channel} element={<ChatRoom channelName={channel}/>} />
		))
	);
}

export default ChatRoutes;
