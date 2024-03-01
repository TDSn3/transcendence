import "./chat.css";

interface BannerProps {
	channelName: string,
}

const Banner = ({channelName}: BannerProps) => {
	return (
		<div className="banner">
			<h3>{channelName}</h3>
		</div>
	);
}

export default Banner;
