
import './GameHeader.css';

const GameHeader = ({ gameInfo }: { gameInfo: any }) => {
	return (
		<div className="game-header">
		<div className="player">
		  <img src={gameInfo.leftPaddle.avatar} />
		  <p>{gameInfo.leftPaddle.playerName}</p>
		</div>
		<div className="player">
		  <img src={gameInfo.rightPaddle.avatar}  />
		  <p>{gameInfo.rightPaddle.playerName}</p>
		</div>
	  </div>
	);
  };
  
  export default GameHeader;