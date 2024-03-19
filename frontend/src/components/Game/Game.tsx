import { useState, useEffect, useRef } from "react";
import PongLocal from "./PongGame.tsx";
import BotvsBot from "./BotvsBot.tsx";
import io from "socket.io-client";
import Lobby from "./Lobby.tsx";
import { useLocation } from "react-router-dom";



// import { useNavigate } from "react-router-dom";

// function Home() {
// 	const navigate = useNavigate();
// 		// navigate("/game");
// 	return (
//     <div className="page">
//       <h3>Home</h3>
//       {/* <button onClick={coucou}>En test</button> */}
// 	  <input type="button" value="←" onClick={() => navigate("/game", {state: {isPrivate: true, isHost: true, key: "CEST LA CLE"}})}/>
// 	  <input type="button" value="rejoindre l invitation" onClick={() => navigate("/game", {state: {isPrivate: true, isHost: false, key: "CEST LA CLE"}})}/>

//     </div>
//   );
// }

// export default Home;

function Game() {

  const [lobby, setLobby] = useState(false);
  const [buttonText, setButtonText] = useState("Play");
  const location = useLocation();
//   const {isPrivate} = location.state;
  const [isPrivate, setIsPrivate] = useState<boolean>(location.state?.isPrivate || false);
//   let isPrivate = location.state?.isPrivate || false;
  const isHost = location.state?.isHost || false;
  const privateKey = location.state?.key || "";
//   const isPrivateRef = useRef<boolean>(location.state?.isPrivate || false);
  console.log(isPrivate);

 useEffect(() => {
	if (isPrivate) {
		setLobby(true);
		setButtonText("Leave game");
		// console.log(isPrivateRef);
	}
 }, [isPrivate]); 
 
  const handleLobby = () => {
    // setLobby(true);
	if (lobby) {
		setLobby(false);
		setButtonText("Play");
		setIsPrivate(false);
		// console.log(isPrivate);
	} else {
		setLobby(true);
		setButtonText("Leave game")
	}
  };

  
  return (
    <div className="page">
      <h3>Game</h3>
      <button onClick={handleLobby}>{buttonText}</button>
      {lobby && <Lobby isPrivate={isPrivate} isHost={isHost} privateKey={privateKey}/>}
     
    </div>
  );
}

export default Game;
