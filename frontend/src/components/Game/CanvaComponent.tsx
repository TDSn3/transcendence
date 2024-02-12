import React, { useRef, useEffect, useState } from 'react';

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}


interface Ball {
	x: number;
	y: number;
	radius: number;
	speedX: number;
	speedY: number;
}
const CanvaComponent: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 10, y: 120, width: 10, height: 60 });
	const [rightPaddle, setRightPaddle] = useState<Paddle>({ x: 480, y: 120, width: 10, height: 60 });
	const [ball, setBall] = useState<Ball>({
		x: 220,
		y: 150,
		radius: 5,
		speedX: 10,
		speedY: 10,
	});
	const [leftScore, setLeftScore] = useState(0);
	const [RightScore, setRightScore] = useState(0);
	const [test, setTest] = useState(0);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (canvas) {
			const context = canvas.getContext('2d');

		if (context) {
			const drawPaddles = () => {
        		context.fillStyle = 'black';
        		context.fillRect(0, 0, canvas.width, canvas.height);
        		context.fillStyle = 'white';
        		context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        		context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
        };

			const handleKeyPress = (event: KeyboardEvent) => {
        		const speed: number = 10; 

        		if (event.key === 'w' && leftPaddle.y - speed >= 0) {
					setLeftPaddle((prev) => ({ ...prev, y: prev.y - speed }));
         		}
				if (event.key === 's' && leftPaddle.y + leftPaddle.height + speed <= canvas.height) {
            		setLeftPaddle((prev) => ({ ...prev, y: prev.y + speed }));
          		}
				if (event.key === 'ArrowUp' && rightPaddle.y - speed >= 0) {
					setRightPaddle((prev) => ({ ...prev, y: prev.y - speed }));
        		}
				if (event.key === 'ArrowDown' && rightPaddle.y + rightPaddle.height + speed <= canvas.height) {
        			setRightPaddle((prev) => ({ ...prev, y: prev.y + speed }));
        		}
				if (event.key === ' '){
					setTest(test + 1);
				}
			};

			const drawBall = () => {
				context.beginPath();
				context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
				context.fillStyle = 'red';
				context.fill();
				context.closePath();
			}

			const updateBall = () => {
				setBall((prev) => ({
				  ...prev,
				  x: prev.x + prev.speedX,
				  y: prev.y + prev.speedY,
				}));
			  };
			const resetBall = () => {
				setBall({
					x:canvas.width / 2,
					y: canvas.height / 2,
					radius: 5,
					speedX: 5,
					speedY: 5,
				});
			};

			if (ball.x - ball.radius < 0) {
				setRightScore((prev) => prev + 1);
				resetBall();
			}
			if (ball.x + ball.radius > canvas.width) {
				setLeftScore((prev) => prev + 1);
				resetBall();
			}
			if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
				setBall((prev) => ({...prev, speedY: -prev.speedY}));
			if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
				setBall((prev) => ({...prev, speedX: -prev.speedX}));
			if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height)
				setBall((prev) => ({...prev, speedX: -prev.speedX}));
			if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height)
				setBall((prev) => ({...prev, speedX: -prev.speedX}));

			const drawMiddleLine = () => {
				const midlleLinewidth = 2;
				const middleLineX = (canvas.width / 2) - (midlleLinewidth / 2);

				context.fillStyle = 'white';
				context.fillRect(middleLineX, 0, midlleLinewidth, canvas.height);
			}
    		const drawGame = () => {
				drawPaddles();
				drawMiddleLine();
				updateBall();
				drawBall();
				context.fillStyle = 'white';
				context.font = '20px Arial';
				context.fillText(`${leftScore} - ${RightScore}`, canvas.width / 2 - 20, 30);
        	};

        	const gameLoop = () => {
        		drawGame();
        		// requestAnimationFrame(gameLoop);
        };

        	gameLoop();


        	window.addEventListener('keydown', handleKeyPress);

			return () => {
        		window.removeEventListener('keydown', handleKeyPress);
        };
      }
    }
  }, [leftPaddle, rightPaddle/*, ball*/, test]);

	

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={300} style={{ border: '0px solid #add8e6' }} />
    </div>
  );
};

export default CanvaComponent;
