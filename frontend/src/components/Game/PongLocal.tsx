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

const PongLocal = () => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [angleStart, setAngleStart] = useState(-Math.PI/4 + (Math.random() * ((Math.PI/4) -  (-Math.PI/4))));
const initialBallState = { x: 400, y: 250, speedX: Math.random() > 0.5 ? 5 * Math.cos(angleStart) : 5 * -Math.cos(angleStart), speedY: 5 * Math.sin(angleStart)};
const initialPaddleState = { left: 150, right: 150 };
const [ball, setBall] = useState(initialBallState);
const [paddles, setPaddles] = useState(initialPaddleState);
const [gameOver, setGameOver] = useState(false);
const [gameRunning, setGameRunning] = useState(false);
const ballRef = useRef(null);
const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 10, y: 220, width: 10, height: 60 });
const [rightPaddle, setRightPaddle] = useState<Paddle>({ x: 780, y: 220, width: 10, height: 60 });
// const [BotPaddle, setBotPaddle] = useState<Paddle>({ x: 780, y: 220, width: 10, height: 60 });
// const [ball, setBall] = useState<Ball>({
// 	x: 250,
// 	y: 150,
// 	radius: 5,
// 	speedX: 0.005,
// 	speedY: 0,
// });
const [leftScore, setLeftScore] = useState(0);
const [RightScore, setRightScore] = useState(0);
const canvas = canvasRef.current;
function drawGame() {

	if (canvas) {
		const context = canvas.getContext('2d');
		
		if (context) {
			const drawPaddles = () => {
				//dessiner le terrain et les paddles
				context.fillStyle = 'black';
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = 'white';
				context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
				context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
		}

			const drawBall = () => {
				context.beginPath();
				context.arc(ball.x, ball.y, 5, 0, 2 * Math.PI, false);
				context.fillStyle = 'red';
				context.fill();
				context.closePath();
			};
			const drawMiddleLine = () => {
				const midlleLinewidth = 1;
				const middleLineX = (canvas.width / 2) - (midlleLinewidth / 2);

				context.fillStyle = 'red';
				context.fillRect(middleLineX, 0, midlleLinewidth, canvas.height);
			};
			drawPaddles();
			drawMiddleLine();				
			drawBall();
			context.fillStyle = 'white';
			context.font = '20px Arial';
			context.fillText(`${leftScore}`, canvas.width / 2 - 30, 30);
			context.fillText(`${RightScore}`, canvas.width / 2 + 20, 30);
		};
	}
}

useEffect(() => {
	if (gameRunning && canvas && !gameOver) {
	const handleKeyPress = (event: KeyboardEvent) => {
		const speed: number = 10;
		if (canvas)
			{
				//gerer les deplacements des paddles
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
		}
	};
	
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
			const targetY = ball.y - rightPaddle.height / 2;
		  
			// Si la différence entre la position actuelle du bot et la position cible est inférieure à la vitesse, déplacez directement le bot à la position cible
			if (Math.abs(rightPaddle.y - targetY) < botSpeed) {
			  setRightPaddle((prev) => ({ ...prev, y: targetY }));
			} else {
			  // Sinon, effectuez le déplacement normal
			  if (rightPaddle.y < targetY) {
				setRightPaddle((prev) => ({ ...prev, y: prev.y + botSpeed }));
			  } else if (rightPaddle.y > targetY) {
				setRightPaddle((prev) => ({ ...prev, y: prev.y - botSpeed }));
			  }
			}
		  };
		  

		const resetBall = () => {
			console.log("couciu");
			setBall({
				x: canvas.width / 2,
				y: canvas.height / 2,
				// radius: 5,
				speedX: 5,
				speedY: 5,
			});
		};

		if (ball.x - 5 < 0) {
			setRightScore((prev) => prev + 1);
			resetBall();
			// setBallSpeed(0.005);
		}
		if (ball.x + 5 > canvas.width) {
			setLeftScore((prev) => prev + 1);
			resetBall();
			// setBallSpeed(0.005);
		}

		if (ball.x - 5 < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
			let relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			const angle = (relativePosition - 0.5) * Math.PI;
			const speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
			const directionX = Math.cos(angle);
			const directionY = Math.sin(angle);
			
			const speedMultiplier = 1.05;
			const newSpeedX = directionX * speed * speedMultiplier;
			const newSpeedY = directionY * speed * speedMultiplier;

			setBall((prev) => ({
				...prev,
				x:leftPaddle.x + leftPaddle.width + 5 ,
				speedX: newSpeedX,
				speedY: newSpeedY,
			}));
		}
		if (ball.x + 5 > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height){
			let relativePosition = (ball.y - rightPaddle.y) / rightPaddle.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			const angle = (relativePosition - 0.5) * Math.PI;
			const speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
			const directionX = -Math.cos(angle);
			const directionY = Math.sin(angle);

			const speedMultiplier = 1.05;
			const newSpeedX = directionX * speed * speedMultiplier;
			const newSpeedY = directionY * speed * speedMultiplier;

			setBall((prev) => ({
				...prev,
				x: rightPaddle.x - 5 ,
				speedX: newSpeedX,
				speedY: newSpeedY,
			}));
		};
		// moveBot();
		drawGame();
		// console.log('x', ball.speedX);
		// console.log('y' ,ball.speedY);
		console.log(angleStart);
		// console.log(Math.sin(14));
	};
	const intervalId = setInterval(updateGame, 15);
	if (leftScore >= 5 || RightScore >= 5)
		setGameOver(true);
	window.addEventListener('keydown', handleKeyPress);

	return () => {
		clearInterval(intervalId);
		window.removeEventListener('keydown', handleKeyPress);
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
	  {gameOver ? leftScore === 5 ? (<p> Le joueur de gauche a gagner</p>): <p> Le joueur de droite a gagner</p> : <p></p>}
    </div>
  );
};
export default PongLocal;
