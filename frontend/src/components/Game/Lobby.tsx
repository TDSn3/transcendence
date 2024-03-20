/* eslint-disable */

import { useState, useEffect, useRef } from "react";
import PongGame from "./PongGame.tsx";
import BotvsBot from "./BotvsBot.tsx";
import NewGameMode from "./newGame.tsx";
import io from "socket.io-client";
import { Socket } from "dgram";
import useAuth from "../../contexts/Auth/useAuth.tsx";

const Lobby = (props: any) => {
  const [localPong, setLocalPong] = useState(false);
  const [IAPong, setIAPong] = useState(false);
  const [BotvsBot1, setBotvsBot] = useState(false);
  const [newGameMode, setNewGameMode] = useState(false);
  const [gameInfos, setGameInfos] = useState<any>(null);
  const [hookTab, setHookTab] = useState<boolean[]>([false, false]);
  const [displayButtons, setDisplayButtons] = useState<boolean>(true);
  const [alreadyPlay, setAlreadyPlay] = useState<boolean>(false);

  const socketRef = useRef<any>(null);
  const {user} = useAuth();


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

//   useEffect (() => {
// 	if (props.isPrivate === true)
// 		joinGame('privateGame');
//   }, []);

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

	socketRef.current.on('alreadyPlay', () => {
		setAlreadyPlay(true);
	})

	document.addEventListener('keydown', handleKeyPress);
	document.addEventListener('keyup', handleKeyUp);

	if (props.isPrivate === true) {
		setLocalPong(true);
		setIAPong(false);
		setBotvsBot(false);
		setDisplayButtons(false);
		joinGame('privateGame');
	}

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

  const handleNewGameMode = () => {
		setLocalPong(false);
   		setIAPong(false);
   		setBotvsBot(false);
		setNewGameMode(true);
		setDisplayButtons(false);
  }

  const joinGame = (gameMode: string) => {
	const paddleInfos = {
		gameMode: gameMode,
		avatar: user.avatar,
		playerName: user.login,
		userId :user.id,
		isHost: props.isHost,
		key: props?.privateKey,
	}
	console.log(paddleInfos.key);
	if (socketRef)
		socketRef.current.emit('joinGame', paddleInfos);
  }

  return (
    <div className="page">
		{displayButtons && ( 
		  <>
      <button onClick={handleLocalPong}>Jouer en PVP</button>
      <button onClick={handleIAPong}>Jouer contre l'ordi</button>
      <button onClick={handleBotvsBot}>Bot vs Bot</button>
      <button onClick={handleNewGameMode}>En test</button>
	  </>
		)}
		{alreadyPlay && (
			<p>You can't join a game for the moment</p>
		)}
	  {gameInfos === null && localPong && !alreadyPlay && (
		<p>Waiting for a game ...</p>
		)}

      {IAPong && <PongGame gameInfo={gameInfos}/>}
      {localPong && <PongGame gameInfo={gameInfos}/>}
      {BotvsBot1 && <BotvsBot />}
      {newGameMode && <NewGameMode />}
    </div>
  );
}

export default Lobby;
