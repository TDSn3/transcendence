
import React, { useRef, useEffect } from "react";

const PongGame = ({ gameInfo }: { gameInfo: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
//   console.log(gameInfo);

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const drawPaddles = () => {
          context.fillStyle = 'black';
          context.fillRect(0, 0, 800, 500);
          context.fillStyle = 'red';
          context.fillRect(gameInfo.leftPaddle.pos.x, gameInfo.leftPaddle.pos.y, gameInfo.leftPaddle.width, gameInfo.leftPaddle.height)
          context.fillRect(gameInfo.rightPaddle.pos.x, gameInfo.rightPaddle.pos.y, gameInfo.rightPaddle.width, gameInfo.rightPaddle.height)
        };

        const drawBall = () => {
          context.beginPath();
          context.arc(gameInfo.ball.pos.x, gameInfo.ball.pos.y, 6, 0, 2 * Math.PI);
          context.fillStyle = 'red';
          context.fill();
          context.closePath();
        };

        const drawMiddleLine = () => {
          const midlleLinewidth = 1;
          const middleLineX = (gameInfo.width / 2) - (midlleLinewidth / 2);
          context.fillStyle = 'white';
          context.fillRect(middleLineX, 0, midlleLinewidth, gameInfo.height);
        };

		const drawScore = () => {
			context.fillStyle = 'white';
			context.font = '20px Arial';
			context.fillText(`${gameInfo.score[0]}`, gameInfo.width / 2 - 30, 30);
			context.fillText(`${gameInfo.score[1]}`, gameInfo.width / 2 + 20, 30);

		}

        drawPaddles();
        drawMiddleLine();
        drawBall();
		drawScore();
      }
    }
  };

  useEffect(() => {
    // console.log('les infos', gameInfo);
	if (gameInfo)
    	drawGame();
  }, [gameInfo]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={500} style={{ border: '0px solid #add8e6' }} />
    </div>
  );
};

export default PongGame;