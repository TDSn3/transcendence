import { Route } from 'react-router-dom';
import ChatRoom from "./ChatRoom.tsx";
import axios from 'axios';

const channels = (await axios.get("http://localhost:5001/api/channels/names")).data;

const ChatRoutes = () => {
	return (
		channels.map((channel: {id:number, name: string}) => (
			<Route key={channel.id} path={"/chat/" + channel.name} element={<ChatRoom channelName={channel.name}/>} />
		))
	);
}

export default ChatRoutes;
