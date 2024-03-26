import { useRef, useEffect } from 'react';
import GameHeader from './GameHeader';
import { Canvas } from './style';

function PongGame({ gameInfo }: { gameInfo: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const drawPaddles = (): void => {
          context.fillStyle = 'black';
          context.fillRect(0, 0, 800, 500);
          context.fillStyle = 'red';
          context.fillRect(
            gameInfo.leftPaddle.pos.x,
            gameInfo.leftPaddle.pos.y,
            gameInfo.leftPaddle.width,
            gameInfo.leftPaddle.height,
          );
          context.fillRect(
            gameInfo.rightPaddle.pos.x,
            gameInfo.rightPaddle.pos.y,
            gameInfo.rightPaddle.width,
            gameInfo.rightPaddle.height,
          );
        };

        const drawBall = (): void => {
          context.beginPath();
          context.arc(
            gameInfo.ball.pos.x,
            gameInfo.ball.pos.y,
            6,
            0,
            2 * Math.PI,
          );
          context.fillStyle = 'red';
          context.fill();
          context.closePath();
        };

        const drawMiddleLine = (): void => {
          const midlleLinewidth = 1;
          const middleLineX = gameInfo.width / 2 - midlleLinewidth / 2;
          context.fillStyle = 'white';
          context.fillRect(middleLineX, 0, midlleLinewidth, gameInfo.height);
        };

        const drawScore = (): void => {
          context.fillStyle = 'white';
          context.font = '20px Arial';
          context.fillText(`${gameInfo.score[0]}`, gameInfo.width / 2 - 30, 30);
          context.fillText(`${gameInfo.score[1]}`, gameInfo.width / 2 + 30, 30);
          // console.log(gameInfo.score[0]);
        };

        const drawCountdown = (): void => {
          context.font = '50px Arial';
          context.fillStyle = 'white';
          context.textAlign = 'center';
          context.fillText(
            `${gameInfo.countdown}`,
            gameInfo.width / 2,
            gameInfo.height / 2 - 30,
          );
        };

        drawPaddles();
        drawMiddleLine();
        drawBall();
        if (gameInfo.countdown > 0) drawCountdown();
        drawScore();
      }
    }
  };

  useEffect(() => {
    if (gameInfo) {
      drawGame();
    }
  }, [gameInfo]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {gameInfo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: 'black',
          }}
        >
          <GameHeader gameInfo={gameInfo} />
          <Canvas ref={canvasRef} height={500} width={800} />
        </div>
      )}
    </div>
  );
}

export default PongGame;
