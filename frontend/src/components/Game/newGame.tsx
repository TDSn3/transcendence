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

const NewGameMode = () => {
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
// const [BotPaddle, setBotPaddle] = useState<Paddle>({ x: 790, y: 220, width: 10, height: 60 });
const [goalSize, setGoalSize] = useState<number>(150);
const [randomSpawn, setRandomSpawn] = useState(Math.round(Math.random() * (500 - goalSize)));

const [BotPaddle1, setBotPaddle1] = useState<Paddle>({ x: 0, y: 220, width: 10, height: 60 });
const [wallPadlle, setWallPaddle] = useState<Paddle>({ x: 790, y: 0, width: 10, height: randomSpawn});
const [wallPadlle2, setWallPaddle2] = useState<Paddle>({ x: 790, y: randomSpawn + goalSize, width: 10, height: 800 - randomSpawn + goalSize});
// const [ball, setBall] = useState<Ball>({
// 	x: 250,
// 	y: 150,
// 	radius: 5,
// 	speedX: 0.005,
// 	speedY: 0,
// });
const [leftScore, setLeftScore] = useState(0);
const [RightScore, setRightScore] = useState(0);
const [hookTab, setHookTab] = useState<boolean[]>([false, false]);
const [countdown, setCountDown] = useState(3);
const [gameStarted, setGameStarted] = useState(false);
const [countdownActive, setCountdownActive] = useState(false);
const [colors, setColors] = useState<string[]>(["#f54542", "#f56f42","#f59942", "#f5da42", "#c2f542", "#87f542", "#42f548", "#42f599", "#42f5ef", "#42b9f5", "#4284f5", "#4242f5", "#8742f5", "#bc42f5", "#f542e6"]);

const canvas = canvasRef.current;
function drawGame() {

	if (canvas) {
		const context = canvas.getContext('2d');
		
		if (context) {
			const drawPaddles = () => {
				console.log(colors);
				//dessiner le terrain et les paddles
				context.fillStyle = colors[leftScore];
				context.fillRect(BotPaddle1.x, BotPaddle1.y, BotPaddle1.width, BotPaddle1.height);
				context.fillStyle = '#0cecf7';
				context.fillRect(wallPadlle.x, wallPadlle.y, wallPadlle.width, wallPadlle.height);
				context.fillRect(wallPadlle2.x, wallPadlle2.y, wallPadlle2.width, wallPadlle2.height);


				// context.fillStyle = 'red';
				// context.fillRect(BotPaddle.x, BotPaddle.y, BotPaddle.width, BotPaddle.height);
		}

			const drawBall = () => {
				context.beginPath();
				context.arc(ball.x, ball.y, 6, 0, 2 * Math.PI, false);
				context.fillStyle = 'white';
				context.fill();
				context.closePath();

				context.beginPath();
				context.arc(canvas.width / 2, canvas.height / 2, 70, 0, 2 * Math.PI);
				context.closePath();
				context.lineWidth = 2;
				context.strokeStyle = '#0cecf7';
				context.stroke();
				context.beginPath();
				context.arc(70, canvas.height / 2, 60, 1/3 * Math.PI, 5/3 * Math.PI, true);
				context.lineWidth = 2;
				context.strokeStyle = '#0cecf7';
				context.stroke();
			};	
			const drawGround = () => {
				context.fillStyle = 'black';
				context.fillRect(0, 0, canvas.width, canvas.height);

				const midlleLinewidth = 2;
				const middleLineX = (canvas.width / 2) - (midlleLinewidth / 2);

				context.fillStyle = '#0cecf7';
				context.fillRect(middleLineX, 0, midlleLinewidth, canvas.height);
				
				context.beginPath();
				context.moveTo(0, canvas.height / 5);
				context.lineTo(100, canvas.height / 5);
				context.lineTo(100, (canvas.height / 5) * 4);
				context.lineTo(0, (canvas.height / 5) * 4);
				context.lineWidth = 2;
				context.strokeStyle = '#0cecf7';
				
				context.moveTo(0, (canvas.height / 5) * 2 );
				context.lineTo(28, (canvas.height / 5) * 2);
				context.lineTo(28, (canvas.height / 5) * 3);
				context.lineTo(0, (canvas.height / 5) * 3);

				context.stroke();
				context.closePath();

				context.beginPath();
				context.arc (66, canvas.height/2, 2, 0, 2 * Math.PI);
				context.fillStyle = '#0cecf7';
				context.fill();

			};
			const drawScore = () => {
				context.fillStyle = 'white';
				context.font = '30px Arial';
				context.fillText(`${leftScore}`, canvas.width / 2  -40, 30);
				// context.fillText(`${RightScore}`, canvas.width / 2 + 20, 30);
			}
			const drawCountdown = (countdownText: number) => {
				context.fillStyle = 'red';
				context.font = '40px Arial';
				context.fillText(`${countdownText}`, canvas.width / 2 -10, canvas.height / 2);
			}

			drawGround();			
			drawPaddles();
			drawBall();
			drawScore();

		};
	}
}



// const generateGradient = () => {
// 	const steps = 15; // Nombre de couleurs dans le dégradé
// 	const startColor = [255, 0, 0]; // Rouge (format RGB)
// 	const endColor = [0, 255, 0]; // Rouge (format RGB)

// 	const gradientColors = [];

// 	// Calculer la différence entre les composantes RGB de départ et d'arrivée
// 	const diffR = (endColor[0] - startColor[0]) / (steps - 1);
// 	const diffG = (endColor[1] - startColor[1]) / (steps - 1);
// 	const diffB = (endColor[2] - startColor[2]) / (steps - 1);

// 	// Générer les couleurs du dégradé
// 	for (let i = 0; i < steps; i++) {
// 		const r = Math.round(startColor[0] + diffR * i);
// 		const g = Math.round(startColor[1] + diffG * i);
// 		const b = Math.round(startColor[2] + diffB * i);
// 		const color = `rgb(${r},${g},${b})`;
// 		gradientColors.push(color);
// 	}

// 	// Mise à jour de l'état avec le dégradé de couleurs
// 	setColors(gradientColors);
// };

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
			if (ball.x - 5 < 0)
				setBall((prev) => ({ ...prev, x: 5, speedX: -prev.speedX }));
			// if (ball.x + 5 > canvas.width)
			// 	setBall((prev) => ({ ...prev, x: canvas.width - 5, speedX: -prev.speedX }));	
		}
		const UpdatePaddle = () => {
			const speed = 7;
			let move = 0;

			if (hookTab[0])
				move -= speed;
			if (hookTab[1])
				move += speed;
			setBotPaddle1((prev) => ({...prev, y: prev.y + move}));
		}
		// const moveBot = () => {
		// 	const botSpeed = 10; 
		  
		// 	const targetY = ball.y - BotPaddle.height / 2;
		// 	if (ball.speedX > 0) {
		  
		// 		if (Math.abs(BotPaddle.y - targetY) < botSpeed +6) {
		// 		  setBotPaddle((prev) => ({ ...prev, y: targetY +6}));
		// 		} else {
		// 	  	if (BotPaddle.y + 20 < targetY) {
		// 			setBotPaddle((prev) => ({ ...prev, y: prev.y + botSpeed }));
		// 		  } else if (BotPaddle.y  -20 > targetY) {
		// 			setBotPaddle((prev) => ({ ...prev, y: prev.y - botSpeed }));
		// 	  	}
		// 		}
		// 	}
		// 	if (ball.speedX < 0) {
		// 		if (Math.abs(BotPaddle1.y - targetY) < botSpeed +6) {
		// 			setBotPaddle1((prev) => ({ ...prev, y: targetY +6}));
		// 	 	 } else {
		// 			if (BotPaddle1.y < targetY) {
		// 		 	 setBotPaddle1((prev) => ({ ...prev, y: prev.y + botSpeed }));
		// 			} else if (BotPaddle1.y > targetY) {
		// 			  setBotPaddle1((prev) => ({ ...prev, y: prev.y - botSpeed }));
		// 			}
		// 	 	 }
		// 	}
		//   };
		  

		const resetBall = (angle: number) => {
			setBall({
				x: canvas.width / 2,
				y: canvas.height / 2,
				// radius: 5,
				speedX: 5 * -Math.cos(angle),
				speedY: 5 * Math.sin(angleStart)
			});
			setBallSpeed(0);
		};

		const updateDifficulty = () => {
			if (goalSize > 10)
				setGoalSize(goalSize - 10);
			setRandomSpawn(Math.round(Math.random() * (500 - goalSize)));
			setWallPaddle({ x: 790, y: 0, width: 10, height: randomSpawn});
			setWallPaddle2({ x: 790, y: randomSpawn + goalSize, width: 10, height: 800 - randomSpawn + goalSize});
			
		}
		// if (ball.x - 5 < 0 && !(ball.y > BotPaddle1.y && ball.y < BotPaddle1.y + BotPaddle1.height)) {
		// 	setRightScore((prev) => prev + 1);
		// 	resetBall(-Math.PI/4 + (Math.random() * (Math.PI/4) - (-Math.PI/4)));
		// }
		if (ball.x + 5 > canvas.width) {
			setLeftScore((prev) => prev + 1);
			updateDifficulty();
			resetBall(-Math.PI/4 + (Math.random() * (Math.PI/4) - (-Math.PI/4)));
		}

		if (ball.x - 5 < BotPaddle1.x + BotPaddle1.width && ball.y + 5 > BotPaddle1.y && ball.y - 5< BotPaddle1.y + BotPaddle1.height) {
			let relativePosition = (ball.y - BotPaddle1.y) / BotPaddle1.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			let angle = (relativePosition - 0.5) * Math.PI;
			if (angle > 1.2)
				angle = 1.2;
			else if (angle < -1.2)
				angle = -1.2;
			let speed = Math.sqrt(ball.speedX  ** 2 + ball.speedY ** 2);
			const directionX = Math.cos(angle);
			const directionY = Math.sin(angle);
			
			speed *= 1.05;
			if (speed > 10)
				speed = 10;
			const newSpeedX = directionX * speed;
			const newSpeedY = directionY * speed;

			setBall((prev) => ({
				...prev,
				x:BotPaddle1.x + BotPaddle1.width + 5 ,
				speedX: newSpeedX,
				speedY: newSpeedY,
			}));
		}

		if (ball.x + 5 > wallPadlle.x && ball.y > wallPadlle.y && ball.y < wallPadlle.y + wallPadlle.height){
			setBall((prev) => ({...prev, x: wallPadlle.x -5 ,speedX: -prev.speedX}));
		}
		if (ball.x + 5 > wallPadlle2.x && ball.y > wallPadlle2.y && ball.y < wallPadlle2.y + wallPadlle2.height){
			setBall((prev) => ({...prev, x:wallPadlle2.x - 5, speedX: -prev.speedX}));
		}
	
		drawGame();
		UpdatePaddle();
	
		console.log(goalSize);
	};
	const intervalId = setInterval(updateGame, 15);
	if (leftScore >= 10 || RightScore >= 10)
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
	// generateGradient();
	setGameRunning(true);
};


const restartGame = () => {
	setBall(initialBallState);
	setPaddles(initialPaddleState);
	setGameOver(false);
	setGameRunning(true);
	setRightScore(0);
	setLeftScore(0);
	setBotPaddle1(({ x: 0, y: 220, width: 10, height: 60 }));
	setRandomSpawn(Math.round(Math.random() * (500 - goalSize)));
	setWallPaddle({ x: 790, y: 0, width: 10, height: randomSpawn});
	setWallPaddle2({ x: 790, y: randomSpawn + goalSize, width: 10, height: 800 - randomSpawn + goalSize});
	setGoalSize(150);
	// setBotPaddle(({ x: 790, y: 220, width: 10, height: 45 }));
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
export default NewGameMode;
