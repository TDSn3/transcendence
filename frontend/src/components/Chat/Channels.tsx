import { Link } from "react-router-dom";
import "./chat.css";
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
	const handleClick: any = (e: any) => {
		const newChan = {
			name: "bob",
			description: "lol",
		}
		axios.post<any>("http://localhost:5001/api/channels", newChan)
			.then(response => {
				console.log('Nouveau canal créé:', response.data);
			})
			.catch(error => {
				console.error('Erreur lors de la création du canal:', error);
			});
		console.log(e);
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
