import {MessageProps} from "./Messages.tsx"
import "./chat.css";

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
	return (
		<li className="channel">
			<button>#{channelName}</button>
		</li>
	);
}

const Channels = () => {
	return (
		<div>
			<div className="banner">
				<h3>Chat</h3><button>+</button>
			</div>
			<ul className="channels">
				{
					test.map((value: ChannelProps) =>
						<Channel channelName={value.channelName} />
					)
				}
			</ul>
		</div>
	);
}

export default Channels;
