import { Link } from "react-router-dom";
import "./channels.css";
import axios from "axios";

interface ChannelProps {
	channelName: string,
}

const test: ChannelProps[] = [
	{
		channelName: "General",
	},
	{
		channelName: "oui",
	},
	{
		channelName: "Coucou",
	},
	{
		channelName: "bob",
	},
	{
		channelName: "suuuuuuu",
	},
]

const Channel = ({channelName}: ChannelProps) => {
	const handleClick: any = () => {
	}

	return (
		<div className="channel">
			<Link to={channelName}>
				<button onClick={handleClick}>{channelName}</button>
			</Link>
		</div>
	);
}

const Channels = () => {
	const handleClick: any = () => {
		axios.post('http://localhost:5001/api/channels/create', { name: "bob", description: "lol" });
	}

	return (
		<div>
			<div className="banner">
				<h3>Chat</h3><button onClick={handleClick}>+</button>
			</div>
			<div className="channels">
				{
					test.map((value: ChannelProps) =>
						<Channel key={value.channelName} channelName={value.channelName} />
					)
				}
			</div>
		</div>
	);
}

export default Channels;
