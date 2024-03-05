import { useState, useEffect } from "react";
import PongIA from "./PongIA.tsx";
import PongLocal from "./PongLocal.tsx";
import BotvsBot from "./BotvsBot.tsx";
import io from "socket.io-client";

const Lobby = () => {
  const [localPong, setLocalPong] = useState(false);
  const [IAPong, setIAPong] = useState(false);
  const [BotvsBot1, setBotvsBot] = useState(false);

//   const socket = io("http://localhost:5001");

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
  };

  useEffect(() => {
	  console.log("Composant Game monté");
	  const socket = io("http://localhost:5001");

    socket.on('connect', () => {
      console.log("Connecté au serveur WebSocket avec succès!");
    });
    socket.on('connect_error', (error) => {
      console.error("Erreur de connexion au serveur WebSocket :", error);
    });
	socket.on('startGame', () => {
		console.log("c'est l'heure du dudu dududu DUEL !!!");
	})

	socket.on('lobbyIsFull', () => {
		console.log("Cest plein mon reuf");
	})
    if (!socket.connected) {
      console.log("Tentative de connexion au serveur WebSocket...");
      socket.connect();
    }
	if (socket)
		socket.emit('joinlobby', "lobby1");

    return () => {
      console.log("Composant Game démonté");
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  
  return (
    <div className="page">
      <button onClick={handleLocalPong}>Jouer en local</button>
      <button onClick={handleIAPong}>Jouer contre l'ordi</button>
      <button onClick={handleBotvsBot}>Bot vs Bot</button>
      {IAPong && <PongIA />}
      {localPong && <PongLocal />}
      {BotvsBot1 && <BotvsBot />}
    </div>
  );
}

export default Lobby;
