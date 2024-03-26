/* eslint-disable */

import { useState, useEffect} from "react";
import Lobby from "./Lobby.tsx";
import { useLocation } from "react-router-dom";

function Game() {

  const [lobby, setLobby] = useState(false);
  const [buttonText, setButtonText] = useState<string>("Play");
  const location = useLocation();
  const [isPrivate, setIsPrivate] = useState<boolean>(location.state?.isPrivate || false);
  const isHost:boolean = location.state?.isHost || false;
  const privateKey:string = location.state?.key || "";

 useEffect(() => {
	if (isPrivate) {
		setLobby(true);
		setButtonText("Leave game");
	}
 }, [isPrivate]); 
 
  const handleLobby = () => {
	if (lobby) {
		setLobby(false);
		setButtonText("Play");
		setIsPrivate(false);
	} else {
		setLobby(true);
		setButtonText("Leave game")
	}
  };

  
  return (
    <div className="page">
      <h3 style={{ marginLeft: 'var(--spacing-small)' }}>Game</h3>
      <button onClick={handleLobby}>{buttonText}</button>
      {lobby && <Lobby isPrivate={isPrivate} isHost={isHost} privateKey={privateKey}/>}
     
    </div>
  );
}

export default Game;
