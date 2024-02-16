import "./chat.css";

export interface MessageProps {
	username: string,
	profilePictureUrl: string,
	message: string,
}

const test: MessageProps[] = [
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hello",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hmmmmmmmmm",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hello",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hmmmmmmmmm",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hello",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hmmmmmmmmm",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hello",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "bob",
		profilePictureUrl: "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
		message: "BANANAAAA",
	},
	{
		username: "djanusz",
		profilePictureUrl: "https://cdn.intra.42.fr/users/cbaa9bc0d6c69dd4368bedefe259ede1/djanusz.jpg",
		message: "Hmmmmmmmmm",
	},
]

const Message = ({username, profilePictureUrl, message}: MessageProps) => {
	const userlink: string = "http://localhost:3001/profile/" + {username};
	return (
		<li className="message">
			<a href={userlink}><img className="profilePicture" src={profilePictureUrl} /></a>
			<div>
				<a href={userlink} className="username">{username}</a><br />
				{message}
			</div>
		</li>
	);
}

const Messages = () => {
	return (
		<ul className="messages">
			{
				test.map((value: MessageProps) => (
					<Message username={value.username} profilePictureUrl={value.profilePictureUrl} message={value.message} />
				))
			}
		</ul>
	);
}

export default Messages;
