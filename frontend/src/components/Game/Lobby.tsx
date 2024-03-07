import { useState, useEffect, useRef } from "react";
import PongGame from "./PongGame.tsx";
import BotvsBot from "./BotvsBot.tsx";
import io from "socket.io-client";
import { Socket } from "dgram";

const Lobby = () => {
  const [localPong, setLocalPong] = useState(false);
  const [IAPong, setIAPong] = useState(false);
  const [BotvsBot1, setBotvsBot] = useState(false);
  const [gameInfos, setGameInfos] = useState<any>(null);
  const [hookTab, setHookTab] = useState<boolean[]>([false, false]);
  const [displayButtons, setDisplayButtons] = useState<boolean>(true);

  const socketRef = useRef<any>(null);

  const handleKeyPress = (event: KeyboardEvent) => {
	  
	  setHookTab(prev => {
		  let updatedTab = [...prev];
 
		  if (event.key === 'w') {
			  updatedTab[0] = true;
		  }
 
		  if (event.key === 's') {
			  updatedTab[1] = true;
		  }
		  return updatedTab;
	   });
  }

  const handleKeyUp = (event: KeyboardEvent) => {
	  
	  setHookTab(prev => {
		  let updatedTab = [...prev];
		  
		  if (event.key === 'w') {
			  updatedTab[0] = false;
		  }
		  
		  if (event.key === 's') {
			  updatedTab[1] = false;
		  }
		  return updatedTab;
	  });	  
  }

  const sendHookTabInfo = (client: Socket) => {
	client?.emit('hookTabInfo', hookTab);
  }

  useEffect(() => {
	sendHookTabInfo(socketRef.current);
  },[hookTab])

  useEffect(() => {

    console.log("Composant Game monté");

    socketRef.current = io("http://localhost:5001/game");

    socketRef.current.on('connect', () => {
      console.log("Connecté au serveur WebSocket avec succès!");
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error("Erreur de connexion au serveur WebSocket :", error);
    });

    socketRef.current.on('startGame', () => {
      console.log("c'est l'heure du dudu dududu DUEL !!!");
    });

    socketRef.current.on('lobbyIsFull', () => {
      console.log("C'est plein mon reuf");
    });

	socketRef.current.on('gameInfo', (gameInfo:any) => {
		// console.log(gameInfo);
		setGameInfos(gameInfo);
	});

	socketRef.current.on('startPVPGame', () => {
		console.log("go pvp");
	})

	document.addEventListener('keydown', handleKeyPress);
	document.addEventListener('keyup', handleKeyUp);

    return () => {
      console.log("Composant Game démonté");
	  document.removeEventListener('keypress', handleKeyPress);
	  document.removeEventListener('keyup', handleKeyUp);
      socketRef.current.disconnect();
    };
  }, []);

  const handleLocalPong = () => {
    setLocalPong(true);
    setIAPong(false);
    setBotvsBot(false);
	joinGame('vsPlayer');
	setDisplayButtons(false);
  };

  const handleIAPong = () => {
    setLocalPong(false);
    setIAPong(true);
    setBotvsBot(false);
	joinGame('vsBot');
	setDisplayButtons(false);

    socketRef.current.emit('startIAPong');
  };

  const handleBotvsBot = () => {
    setLocalPong(false);
    setIAPong(false);
    setBotvsBot(true);
	setDisplayButtons(false);

    socketRef.current.emit('startBotvsBot');
  };

  const joinGame = (gameMode: string) => {
	if (socketRef)
		socketRef.current.emit('joinGame', gameMode);
  }

  return (
    <div className="page">
		{displayButtons && ( 
		  <>
      <button onClick={handleLocalPong}>Jouer en PVP</button>
      <button onClick={handleIAPong}>Jouer contre l'ordi</button>
      <button onClick={handleBotvsBot}>Bot vs Bot</button>
	  </>
		)}
      {IAPong && <PongGame gameInfo={gameInfos}/>}
      {localPong && <PongGame gameInfo={gameInfos}/>}
      {BotvsBot1 && <BotvsBot />}
    </div>
  );
}

export default Lobby;
