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

const PongIA = () => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [angleStart, setAngleStart] = useState(-Math.PI/4 + (Math.random() * ((Math.PI/4) -  (-Math.PI/4))));
// const initialBallState = { x: 400, y: 250, speedX: Math.random() > 0.5 ? 5 * Math.cos(angleStart) : 5 * -Math.cos(angleStart), speedY: 5 * Math.sin(angleStart)};
const initialBallState = { x: 400, y: 250, speedX: 5, speedY: 0};
const initialPaddleState = { left: 150, right: 150 };
const [ball, setBall] = useState(initialBallState);
const [ballSpeed, setBallSpeed] = useState(0);
const [paddles, setPaddles] = useState(initialPaddleState);
const [gameOver, setGameOver] = useState(false);
const [gameRunning, setGameRunning] = useState(false);
const ballRef = useRef(null);
const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 0, y: 220, width: 10, height: 60 });
const [BotPaddle, setBotPaddle] = useState<Paddle>({ x: 790, y: 220, width: 10, height: 60 });
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
				context.fillStyle = 'red';
				context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
				context.fillRect(BotPaddle.x, BotPaddle.y, BotPaddle.width, BotPaddle.height);
		}

			const drawBall = () => {
				context.beginPath();
				context.arc(ball.x, ball.y, 6, 0, 2 * Math.PI, false);
				context.fillStyle = 'red';
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

			if (countdownActive) {
				drawCountdown(countdown);
				}
		};
	}
}

useEffect(() => {
	if (gameRunning && canvas && !gameOver) {
	const handleKeyPress = (event: KeyboardEvent) => {
		if (canvas)
			{
				//gerer les deplacements des paddles
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

	const UpdatePaddle = () => {
		let move = 0;

		if (hookTab[0] === true && leftPaddle.y  >= 0)
			move -= 8;
		if (hookTab[1] === true && leftPaddle.y + leftPaddle.height <= canvas.height)
			move += 8;
		setLeftPaddle((prev) => ({...prev, y: prev.y + move}));
	}
	
	const updateGame = () => {
		// mettre a jour le jeu
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
			// if (ball.x + 5 > canvas.width) 
			// 		setBall((prev) => ({ ...prev, x: canvas.width - 5, speedX: -prev.speedX }));
			// if (ball.x - 5 < 0) 
			// 		setBall((prev) => ({ ...prev, x: 5, speedX: -prev.speedX }));
			
		}
		
		const moveBot = () => {
			const botSpeed = 5; // Ajustez la vitesse du bot
		  
			// Calculer la coordonnée y cible pour le bot en fonction de la position de la balle
			const targetY = ball.y - BotPaddle.height / 2;
		  
			// Si la différence entre la position actuelle du bot et la position cible est inférieure à la vitesse, déplacez directement le bot à la position cible
			if (Math.abs(BotPaddle.y - targetY) < botSpeed) {
			  setBotPaddle((prev) => ({ ...prev, y: targetY }));
			} else {
			  // Sinon, effectuez le déplacement normal
			  if (BotPaddle.y < targetY) {
				setBotPaddle((prev) => ({ ...prev, y: prev.y + botSpeed }));
			  } else if (BotPaddle.y > targetY) {
				setBotPaddle((prev) => ({ ...prev, y: prev.y - botSpeed }));
			  }
			}
		  };
		  

		const resetBall = () => {
			setBall({
				x: canvas.width / 2,
				y: canvas.height / 2,
				// radius: 5,
				speedX: 5,
				speedY: 5,
			});
			setBallSpeed(0);
		};

		if (ball.x - 5 < 0 && !(ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height)) {
			setRightScore((prev) => prev + 1);
			resetBall();
			// setBallSpeed(0.005);
		}
		if (ball.x + 5 > canvas.width && !(ball.y > BotPaddle.y && ball.y < BotPaddle.y + BotPaddle.height)) {
			setLeftScore((prev) => prev + 1);
			resetBall();
			// setBallSpeed(0.005);
		}

		if (ball.x - 5 < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
			let relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;
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
				x:leftPaddle.x + leftPaddle.width + 5 ,
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
		UpdatePaddle();
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
	setCountdownActive(true);
	setGameRunning(true);
};

const handleCountdown = () => {
	if (countdown >  0) {
	  setCountDown(countdown -  1);
	  setTimeout(handleCountdown,  1000); // Decrement every second
	} else {
	  setCountdownActive(false); // Stop the countdown when it reaches  0
	  setGameRunning(true); // Start the game
	}
  };
  

  useEffect(() => {
	if (countdownActive && countdown >  0) {
	  handleCountdown();
	}
  }, [countdownActive, countdown]);
  

const restartGame = () => {
	setBall(initialBallState);
	setPaddles(initialPaddleState);
	setGameOver(false);
	setGameRunning(true);
	setRightScore(0);
	setLeftScore(0);
	setLeftPaddle(({ x: 0, y: 220, width: 10, height: 60 }));
	setBotPaddle(({ x: 790, y: 220, width: 10, height: 60 }));
	setBallSpeed(0);
	setAngleStart(-Math.PI/4 + Math.random() * ((Math.PI/4) -  (-Math.PI/4)));
	setCountDown(3);
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
	  {gameOver ? leftScore === 5 ? (<p> Vous etes le boss</p>): <p>vous avez perdu</p> : <p></p>}
    </div>
  );
};
export default PongIA;
