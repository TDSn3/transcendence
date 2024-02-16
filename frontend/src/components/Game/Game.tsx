// TODO
import { useState } from "react";
import PongIA from "./PongIA.tsx";
import PongLocal from "./PongLocal.tsx";


function Game() {
	const[localPong, setLocalPong] = useState(false);
	const[IAPong, setIAPong] = useState(false);

	const handleLocalPong = () => {
		setLocalPong(true);
		setIAPong(false);
	};

	const handleIAPong = () => {
		setLocalPong(false);
		setIAPong(true);
	};

  return (
    <div className="page">
      <h3>Game</h3>
	  <button onClick={handleLocalPong}>Jouer en local</button>
	  <button onClick={handleIAPong}>Jouer contre l'ordi</button>
	  {IAPong && <PongIA />}
	  {localPong &&  <PongLocal />}
    </div>
  );
}

export default Game;
