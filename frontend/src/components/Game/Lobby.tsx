/* eslint-disable */

import { useState, useEffect, useRef } from "react";
import PongGame from "./PongGame.tsx";
import BotvsBot from "./BotvsBot.tsx";
import SoloMode from "./newGame.tsx";
import io from "socket.io-client";
import { Socket } from "dgram";
import useAuth from "../../contexts/Auth/useAuth.tsx";
import "./Lobby.css";


interface LobbyProps {
	isHost: boolean;
	isPrivate: boolean;
	privateKey: string;
};

const Lobby = (props: LobbyProps) => {
  const [localPong, setLocalPong] = useState<boolean>(false);
  const [IAPong, setIAPong] = useState<boolean>(false);
  const [BotvsBot1, setBotvsBot] = useState<boolean>(false);
  const [soloMode, setSoloMode] = useState<boolean>(false);
  const [gameInfos, setGameInfos] = useState<any>(null);
  const [hookTab, setHookTab] = useState<boolean[]>([false, false]);
  const [displayButtons, setDisplayButtons] = useState<boolean>(true);
  const [alreadyPlay, setAlreadyPlay] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const {user} = useAuth();

  const handleKeyPress = (event: KeyboardEvent):void => {
	  
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

  const handleKeyUp = (event: KeyboardEvent):void => {
	  
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

  const sendHookTabInfo = (client: Socket | null):void => {
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
	if (socketRef.current === null)
    	socketRef.current = io("http://localhost:5001/game") as unknown as Socket;

    socketRef.current.on('connect', () => {
      console.log("Connecté au serveur WebSocket avec succès!");
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error("Erreur de connexion au serveur WebSocket :", error);
    });

	socketRef.current.on('gameInfo', (gameInfo:any) => {
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
      socketRef.current?.disconnect();
    };
  }, []);

  const handleLocalPong = ():void => {
    setLocalPong(true);
    setIAPong(false);
    setBotvsBot(false);
	joinGame('vsPlayer');
	setSoloMode(false);
	setDisplayButtons(false);
  };

  const handleIAPong = ():void => {
    setLocalPong(false);
    setIAPong(true);
    setBotvsBot(false);
	joinGame('vsBot');
	setSoloMode(false);
	setDisplayButtons(false);

    socketRef.current?.emit('startIAPong');
  };

  const handleBotvsBot = ():void => {
    setLocalPong(false);
    setIAPong(false);
    setBotvsBot(true);
	setSoloMode(false);
	setDisplayButtons(false);

    socketRef.current?.emit('startBotvsBot');
  };

  const handleSoloGame = ():void => {
		setLocalPong(false);
   		setIAPong(false);
   		setBotvsBot(false);
		setSoloMode(true);
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
	// console.log(paddleInfos.key);
	if (socketRef)
		socketRef.current?.emit('joinGame', paddleInfos);
  }

  return (
	<div className="page">
	  {displayButtons && (
		<div>
		  <div className="card-container">
			<div className="card">
				<h2>PVP</h2>
			  <p>- You play against another user</p>
			  <p>- Rules: The first to have 5 points wins the part</p>
			  <p>- Controls: Up: 'W' / Down: 'S'</p>
			  <p>- Play in this gamemode to reach rank 1</p>
			</div>
			<div className="card">
				<h2>PVE</h2>
			  <p>- You play against a BOT</p>
			  <p>- Rules: The first to have 5 points wins the part</p>
			  <p>- Controls: Up: 'W' / Down: 'S'</p>
			  <p>- Play in this gamemode to practice</p>
			</div>
			<div className="card">
				<h2>SOLO</h2>
				<p>- You play against no one</p>
				<p>- Rules: You have 3 minutes to score the most goals</p>
				<p>- Everytime You score, the size and the location of the goal change</p>
				<p>- Play in this gamemode to chill</p>


			</div>
		  </div>
  
		  <div className="button-container">
			<button onClick={handleLocalPong}>Jouer en PVP</button>
			<button onClick={handleIAPong}>Jouer contre l'ordi</button>
			<button onClick={handleSoloGame}>Solo Game</button>
		  </div>
		</div>
	  )}
  
	  {}
	  {alreadyPlay && (
		<p>You can't join a game for the moment</p>
	  )}
	  {gameInfos === null && localPong && !alreadyPlay && (
		<p>Waiting for a game ...</p>
	  )}
  
	  {IAPong && <PongGame gameInfo={gameInfos}/>}
	  {localPong && <PongGame gameInfo={gameInfos}/>}
	  {BotvsBot1 && <BotvsBot />}
	  {soloMode && <SoloMode avatar={user.avatar} playerName={user.login}/>}
	</div>
  );
  
  
}

export default Lobby;
