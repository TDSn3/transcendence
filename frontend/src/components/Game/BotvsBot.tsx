//App.js
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

import React, { useState, useEffect, useRef } from 'react';

const BotvsBot = () => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [angleStart, setAngleStart] = useState(-Math.PI/4 + (Math.random() * ((Math.PI/4) -  (-Math.PI/4))));
const initialBallState = { x: 400, y: 200, speedX: Math.random() > 0.5 ? 10 * Math.cos(angleStart) : 10 * -Math.cos(angleStart), speedY: 10 * Math.sin(angleStart)};
// const initialBallState = { x: 400, y: 250, speedX: 5, speedY: 0};
const initialPaddleState = { left: 150, right: 150 };
const [ball, setBall] = useState(initialBallState);
const [ballSpeed, setBallSpeed] = useState(0);
const [paddles, setPaddles] = useState(initialPaddleState);
const [gameOver, setGameOver] = useState(false);
const [gameRunning, setGameRunning] = useState(false);
const ballRef = useRef(null);
// const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 0, y: 220, width: 10, height: 60 });
const [BotPaddle, setBotPaddle] = useState<Paddle>({ x: 790, y: 220, width: 10, height: 60 });
const [BotPaddle1, setBotPaddle1] = useState<Paddle>({ x: 0, y: 220, width: 10, height: 60 });
// const [ball, setBall] = useState<Ball>({
// 	x: 250,
// 	y: 150,
// 	radius: 5,
// 	speedX: 0.005,
// 	speedY: 0,
// });
const [leftScore, setLeftScore] = useState(0);
const [RightScore, setRightScore] = useState(0);
const [hookTab, setHookTab] = useState<boolean[]>([false, false, false]);
const [countdown, setCountDown] = useState(3);
const [gameStarted, setGameStarted] = useState(false);
const [countdownActive, setCountdownActive] = useState(false);

const canvas = canvasRef.current;
function drawGame() {

	if (canvas) {
		const context = canvas.getContext('2d');
		
		if (context) {
			const drawPaddles = () => {
				//dessiner le terrain et les paddles
				context.fillStyle = 'black';
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = 'blue';
				context.fillRect(BotPaddle1.x, BotPaddle1.y, BotPaddle1.width, BotPaddle1.height);
				context.fillStyle = 'red';
				context.fillRect(BotPaddle.x, BotPaddle.y, BotPaddle.width, BotPaddle.height);
		}

			const drawBall = () => {
				context.beginPath();
				context.arc(ball.x, ball.y, 6, 0, 2 * Math.PI, false);
				context.fillStyle = 'white';
				context.fill();
				context.closePath();
			};
			const drawMiddleLine = () => {
				const midlleLinewidth = 1;
				const middleLineX = (canvas.width / 2) - (midlleLinewidth / 2);

				context.fillStyle = 'white';
				context.fillRect(middleLineX, 0, midlleLinewidth, canvas.height);
			};
			const drawScore = () => {
				context.fillStyle = 'white';
				context.font = '20px Arial';
				context.fillText(`${leftScore}`, canvas.width / 2 - 30, 30);
				context.fillText(`${RightScore}`, canvas.width / 2 + 20, 30);
			}
			const drawCountdown = (countdownText: number) => {
				context.fillStyle = 'red';
				context.font = '40px Arial';
				context.fillText(`${countdownText}`, canvas.width / 2 -10, canvas.height / 2);
			}

			drawPaddles();
			drawMiddleLine();				
			drawBall();
			drawScore();

		};
	}
}

useEffect(() => {
	if (gameRunning && canvas && !gameOver) {
	const handleKeyPress = (event: KeyboardEvent) => {
		if (canvas)
			{
				setHookTab(prev => {
					let updatedTab = [...prev];

					if (event.key === 'w')
						updatedTab[0] = true;
					if (event.key === 's')
						updatedTab[1] = true;
					if (event.key === 'm')
						updatedTab[2] = true;
					return updatedTab;
				})
		}
	};

	const handleKeyUp = (event: KeyboardEvent) => {
		
		setHookTab(prev => {
			let updatedTab = [...prev];
   
			if (event.key === 'w') {
			   updatedTab[0] = false;
			}
   
			if (event.key === 's') {
			   updatedTab[1] = false;
			}
   
			if (event.key === 'm') {
			   updatedTab[2] = false;
			}
   
			return updatedTab;
		 });
		
	}


	
	const updateGame = () => {
		setBall((prevBall) => ({
		...prevBall,
		x: prevBall.x + prevBall.speedX,
		y: prevBall.y + prevBall.speedY,
		}));

		if (canvas)
		{
			if (ball.y + 5 > canvas.height)
				setBall((prev) => ({ ...prev, y: canvas.height - 5, speedY: -prev.speedY }));
			if (ball.y - 5 < 0)
				setBall((prev) => ({ ...prev, y: 5, speedY: -prev.speedY }));			
		}
		
		const moveBot = () => {
			const botSpeed = 10; 
		  
			const targetY = ball.y - BotPaddle.height / 2;
			if (ball.speedX > 0) {
		  
				if (Math.abs(BotPaddle.y - targetY) < botSpeed +6) {
				  setBotPaddle((prev) => ({ ...prev, y: targetY +6}));
				} else {
			  	if (BotPaddle.y + 20 < targetY) {
					setBotPaddle((prev) => ({ ...prev, y: prev.y + botSpeed }));
				  } else if (BotPaddle.y  -20 > targetY) {
					setBotPaddle((prev) => ({ ...prev, y: prev.y - botSpeed }));
			  	}
				}
			}
			if (ball.speedX < 0) {
				if (Math.abs(BotPaddle1.y - targetY) < botSpeed +6) {
					setBotPaddle1((prev) => ({ ...prev, y: targetY +6}));
			 	 } else {
					if (BotPaddle1.y < targetY) {
				 	 setBotPaddle1((prev) => ({ ...prev, y: prev.y + botSpeed }));
					} else if (BotPaddle1.y > targetY) {
					  setBotPaddle1((prev) => ({ ...prev, y: prev.y - botSpeed }));
					}
			 	 }
			}
		  };
		  

		const resetBall = (angle: number) => {
			setBall({
				x: canvas.width / 2,
				y: canvas.height / 2,
				// radius: 5,
				speedX: Math.random() > 0.5 ? 10 * Math.cos(angle) : 10 * -Math.cos(angle),
				speedY: 10 * Math.sin(angleStart)
			});
			setBallSpeed(0);
		};

		if (ball.x - 5 < 0 && !(ball.y > BotPaddle1.y && ball.y < BotPaddle1.y + BotPaddle1.height)) {
			setRightScore((prev) => prev + 1);
			resetBall(-Math.PI/4 + (Math.random() * (Math.PI/4) - (-Math.PI/4)));
		}
		if (ball.x + 5 > canvas.width && !(ball.y > BotPaddle.y && ball.y < BotPaddle.y + BotPaddle.height)) {
			setLeftScore((prev) => prev + 1);
			resetBall(-Math.PI/4 + (Math.random() * (Math.PI/4) - (-Math.PI/4)));
		}

		if (ball.x - 5 < BotPaddle1.x + BotPaddle1.width && ball.y > BotPaddle1.y && ball.y < BotPaddle1.y + BotPaddle1.height) {
			let relativePosition = (ball.y - BotPaddle1.y) / BotPaddle1.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			const angle = (relativePosition - 0.5) * Math.PI;
			let speed = Math.sqrt(ball.speedX  ** 2 + ball.speedY ** 2);
			const directionX = Math.cos(angle);
			const directionY = Math.sin(angle);
			
			speed *= 1.05;
			if (speed > 20)
				speed = 20;
			const newSpeedX = directionX * speed;
			const newSpeedY = directionY * speed;

			setBall((prev) => ({
				...prev,
				x:BotPaddle1.x + BotPaddle1.width + 5 ,
				speedX: newSpeedX,
				speedY: newSpeedY,
			}));
		}
		if (ball.x + 5 > BotPaddle.x && ball.y > BotPaddle.y && ball.y < BotPaddle.y + BotPaddle.height){
			let relativePosition = (ball.y - BotPaddle.y) / BotPaddle.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			const angle = (relativePosition - 0.5) * Math.PI;
			let speed = Math.sqrt(ball.speedX  ** 2 + ball.speedY ** 2);
			const directionX = -Math.cos(angle);
			const directionY = Math.sin(angle);
			
			speed *= 1.05;
			if (speed > 20)
				speed = 20;
			const newSpeedX = directionX * speed;
			const newSpeedY = directionY * speed;

			setBall((prev) => ({
				...prev,
				x: BotPaddle.x - 5 ,
				speedX: newSpeedX,
				speedY: newSpeedY,
			}));
		};
		// UpdatePaddle();
		moveBot();
		drawGame();
	
		console.log(ball.speedX);
	};
	const intervalId = setInterval(updateGame, 15);
	if (leftScore >= 5 || RightScore >= 5)
		setGameOver(true);
	window.addEventListener('keydown', handleKeyPress);
	window.addEventListener('keyup', handleKeyUp);

	return () => {
		clearInterval(intervalId);
		window.removeEventListener('keydown', handleKeyPress);
		window.removeEventListener('keyup', handleKeyUp);
	};
	};
}, [gameRunning, ball, RightScore, leftScore]);


const startGame = () => {
	setGameRunning(true);
};


const restartGame = () => {
	setBall(initialBallState);
	setPaddles(initialPaddleState);
	setGameOver(false);
	setGameRunning(true);
	setRightScore(0);
	setLeftScore(0);
	setBotPaddle1(({ x: 0, y: 220, width: 10, height: 45 }));
	setBotPaddle(({ x: 790, y: 220, width: 10, height: 45 }));
	setBallSpeed(0);
	setAngleStart(-Math.PI/4 + Math.random() * ((Math.PI/4) -  (-Math.PI/4)));
};

const pauseGame = () => {
	setGameRunning(false);
};

return (
    <div>
		<button onClick={startGame}>Start</button>
        <button onClick={restartGame}>Restart</button>
        <button onClick={pauseGame}>Pause</button>
      <canvas ref={canvasRef} width={800} height={500} style={{ border: '0px solid #add8e6' }} />
	  {gameOver ? leftScore === 5 ? (<p> Blue Win </p>): <p>Red Win</p> : <p></p>}
    </div>
  );
};
export default BotvsBot;
