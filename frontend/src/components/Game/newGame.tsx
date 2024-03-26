import './GameHeader.css'
import { useState, useEffect, useRef } from 'react';
import GameSoloHeader from './GameSoloHeader';

interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
  }

const SoloMode = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleStartRef = useRef<number>(-Math.PI/4 + (Math.random() * ((Math.PI/4) -  (-Math.PI/4))));
  const initialBallState = { x: 400, y: 250, speedX: 5 * -Math.cos(angleStartRef.current), speedY: 5 * Math.sin(angleStartRef.current)};
  const [ball, setBall] = useState(initialBallState);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [goalSize, setGoalSize] = useState<number>(150);
  const [randomSpawn, setRandomSpawn] = useState(Math.round(Math.random() * (500 - goalSize)));

  const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 0, y: 220, width: 10, height: 60 });
  const [wallPadlle, setWallPaddle] = useState<Paddle>({ x: 790, y: 0, width: 10, height: randomSpawn});
  const [wallPadlle2, setWallPaddle2] = useState<Paddle>({ x: 790, y: randomSpawn + goalSize, width: 10, height: 800 - randomSpawn + goalSize});

  const [leftScore, setLeftScore] = useState(0);
  const [hookTab, setHookTab] = useState<boolean[]>([false, false]);
  const [colors, setColors] = useState<string>("#03fc66");
  const maxtime:number = 5;
  const [timeLeft, setTimeLeft] = useState<number>(maxtime);
  const startTimerRef = useRef<number>(Date.now());

  const canvas = canvasRef.current;
  function drawGame() {

	if (canvas) {
	  const context = canvas.getContext('2d');
		
	  if (context) {
			const drawPaddles = () => {
				
				context.fillStyle = colors;
				context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
				context.fillStyle = '#0cecf7';
				context.fillRect(wallPadlle.x, wallPadlle.y, wallPadlle.width, wallPadlle.height);
				context.fillRect(wallPadlle2.x, wallPadlle2.y, wallPadlle2.width, wallPadlle2.height);
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
			}
			
			drawGround();			
			drawPaddles();
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
			if (ball.x - 5 < 0)
				setBall((prev) => ({ ...prev, x: 5, speedX: -prev.speedX }));	
		}
		const UpdatePaddle = () => {
			const speed = 7;
			let move = 0;

			if (hookTab[0] && leftPaddle.y + (leftPaddle.height / 2) > 0)
				move -= speed;
			if (hookTab[1] && leftPaddle.y + leftPaddle.height -  (leftPaddle.height / 2) < canvas.height)
				move += speed;
			setLeftPaddle((prev) => ({...prev, y: prev.y + move}));
		}
	
		const resetBall = (angle: number) => {
			setBall({
				x: canvas.width / 2,
				y: canvas.height / 2,
				speedX: 5 * -Math.cos(angle),
				speedY: 5 * Math.sin(angle)
			});
		};

		const updateDifficulty = () => {
			if (goalSize > 10)
				setGoalSize(goalSize - 10);
			if (leftScore === 1)
				setColors("#31fc03")
			else if (leftScore === 3)
				setColors("#d7fc03")
			else if (leftScore === 5)
				setColors("#fca903")
			else if (leftScore === 7)
				setColors("#fc2c03")
			
		}
		if (ball.x + 5 > canvas.width) {
			setLeftScore((prev) => prev + 1);

			updateDifficulty();
			resetBall(-Math.PI/4 + (Math.random() * (Math.PI/4) - (-Math.PI/4)));
		}

		if (ball.x - 5 < leftPaddle.x + leftPaddle.width && ball.y + 5 > leftPaddle.y && ball.y - 5< leftPaddle.y + leftPaddle.height) {
			let relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;
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
				x:leftPaddle.x + leftPaddle.width + 5 ,
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
		updateTimer();
	
	};

	const updateTimer = () => {
		const actualTime:number = Date.now();

		setTimeLeft(maxtime - (actualTime - startTimerRef.current) / 1000);
		if (timeLeft <= 0) {
			setGameOver(true);
		}
	};

	const intervalId = setInterval(updateGame, 15);
	if (leftScore >= 10)
		setGameOver(true);
	window.addEventListener('keydown', handleKeyPress);
	window.addEventListener('keyup', handleKeyUp);

	return () => {
		clearInterval(intervalId);
		window.removeEventListener('keydown', handleKeyPress);
		window.removeEventListener('keyup', handleKeyUp);
	};
	}
	else {
		setGameRunning(true);
	};
}, [gameRunning, ball, leftScore]);


useEffect(() => {
	setRandomSpawn(Math.round(Math.random() * (500 - goalSize)));
	setWallPaddle({ x: 790, y: 0, width: 10, height: randomSpawn});
	setWallPaddle2({ x: 790, y: randomSpawn + goalSize, width: 10, height: 800 - randomSpawn + goalSize});
}, [goalSize])

return (
    <div>
	  <GameSoloHeader avatar={props.avatar} playerName={props.playerName} timeLeft={timeLeft} />
      <canvas ref={canvasRef} width={800} height={500} className="canvas" />
	  {gameOver ? <p> Game Over, your score is {leftScore} </p>: <p></p>} 
    </div>
  );
};
export default SoloMode;
