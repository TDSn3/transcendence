import { Route } from 'react-router-dom';
import ChatRender from "./Chatrender.tsx";

const channels = ['General', 'oui', 'Coucou', 'bob', 'suuuuuuu'];

const ChatRoutes = () => {
	return (
		channels.map((channel) => (
			<Route key={channel} path={"/chat/" + channel} element={<ChatRender channelName={channel}/>} />
		))
	);
}

export default ChatRoutes;
