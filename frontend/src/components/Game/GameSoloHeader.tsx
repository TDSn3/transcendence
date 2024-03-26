import './GameSoloHeader.css';

const GameSoloHeader = (props: any) => {
  const formatTime = (second: number) => {
    if (second < 0) second = 0;
    second = Math.round(second);
    const minute = Math.floor(second / 60);
    const remainingSeconds = second % 60;
    return `${minute}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="game-soloheader">
      <div className="player">
        <img src={props.avatar} />
        <p>{props.playerName}</p>
      </div>
      <div className="timer">
        <p>{formatTime(props.timeLeft)}</p>
      </div>
    </div>
  );
};

export default GameSoloHeader;
