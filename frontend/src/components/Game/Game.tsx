import { useState, useEffect } from "react";
import PongIA from "./PongIA.tsx";
import PongLocal from "./PongLocal.tsx";
import BotvsBot from "./BotvsBot.tsx";
import io from "socket.io-client";
import Lobby from "./Lobby.tsx";


function Game() {

  const [lobby, setLobby] = useState(false);
  const [buttonText, setButtonText] = useState("Join lobby");

  const handleLobby = () => {
    // setLobby(true);
	if (lobby) {
		setLobby(false);
		setButtonText("Join lobby");
	} else {
		setLobby(true);
		setButtonText("Quit lobby")
	}
   
  };

  
  return (
    <div className="page">
      <h3>Game</h3>
      <button onClick={handleLobby}>{buttonText}</button>
      {lobby && <Lobby />}
     
    </div>
  );
}

export default Game;
