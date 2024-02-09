import {Message, MessageType} from "./Message.tsx";
import "./chat.css";

const test: any = [
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
]

const MessageList = () => {
	// let res: any = document.createElement("ul");
	// console.log(res);
	// test.forEach((i: any) => {
	// 	let elem: any = document.createElement("Message");
	// 	res.appendChild(elem);
	// });
	return (
		<ul id="messages">
			<Message username={test[0].username} profilePictureUrl={test[0].profilePictureUrl} message={test[0].message} />
			<Message username={test[1].username} profilePictureUrl={test[1].profilePictureUrl} message={test[1].message} />
		</ul>
	);
}



export default MessageList;
