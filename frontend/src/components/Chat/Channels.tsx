import { useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";
import Popup from "./Popup.tsx";
import "./channels.css";

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
		console.log("you clicked on ", channelName);
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
	const [buttonPopup, setButtonPopup] = useState(false);
	// axios.post('http://localhost:5001/api/channels/create', { name: "bob", description: "lol" });
	const handleSubmit: any = (e: any) => {
		e.preventDefault();
	}

	return (
		<div>
			<div className="banner">
				<h3>Chat</h3><button className="create-btn" onClick={() => setButtonPopup(!buttonPopup)}>+</button>
			</div>
			<div className="channels">
				{
					test.map((value: ChannelProps) =>
						<Channel key={value.channelName} channelName={value.channelName} />
					)
				}
			</div>
			<Popup className="create" trigger={buttonPopup} setTrigger={setButtonPopup}>
				<h4 className="create-title">Channel creation</h4>
				<form className="create-form" onSubmit={handleSubmit}>
					<input type="text" placeholder="Name" autoComplete="off"/>
					<input type="text" placeholder="Password" autoComplete="off"/>
					<button>Send</button>
					{/* <input type="button" value="Send" /> */}
				</form>
			</Popup>
		</div>
	);
}

export default Channels;
