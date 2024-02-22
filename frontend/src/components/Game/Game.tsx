// TODO
import { useState } from "react";
import PongIA from "./PongIA.tsx";
import PongLocal from "./PongLocal.tsx";
import BotvsBot from "./BotvsBot.tsx";

function Game() {
	const[localPong, setLocalPong] = useState(false);
	const[IAPong, setIAPong] = useState(false);
	const[BotvsBot1, setBotvsBot] = useState(false);

	const handleLocalPong = () => {
		setLocalPong(true);
		setIAPong(false);
		setBotvsBot(false);

	};

	const handleIAPong = () => {
		setLocalPong(false);
		setIAPong(true);
		setBotvsBot(false);

	};

	const handleBotvsBot = () => {
		setLocalPong(false);
		setIAPong(false);
		setBotvsBot(true);
	}

  return (
    <div className="page">
      <h3>Game</h3>
	  <button onClick={handleLocalPong}>Jouer en local</button>
	  <button onClick={handleIAPong}>Jouer contre l'ordi</button>
	  <button onClick={handleBotvsBot}>Bot vs Bot</button>
	  {IAPong && <PongIA />}
	  {localPong &&  <PongLocal />}
	  {BotvsBot1 &&  <BotvsBot />}
    </div>
  );
}

export default Game;
