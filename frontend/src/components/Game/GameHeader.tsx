/* eslint-disable */

import './GameHeader.css';

const GameHeader = ({ gameInfo }: { gameInfo: any }) => {

	const formatTime = (second:number) => {
		second = Math.round(second);
		const minute = Math.floor(second / 60);
		const remainingSeconds = second % 60;
		return `${minute}:${remainingSeconds < 10 ? '0': ''}${remainingSeconds}`
	}

	return (
		<div className="game-header">
		<div className="player">
		  <img src={gameInfo.leftPaddle.avatar} />
		  <p>{gameInfo.leftPaddle.playerName}</p>
		</div>
		<div className="timer">
			<p>{formatTime(gameInfo.timeLeft)}</p>
		</div>
		<div className="player">
		  <img src={gameInfo.rightPaddle.avatar}  />
		  <p>{gameInfo.rightPaddle.playerName}</p>
		</div>
	  </div>
	);
  };
  
  export default GameHeader;