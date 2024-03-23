// /* eslint-disable */

// import React, { useRef, useEffect, useState } from 'react';

// interface Paddle {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// interface Ball {
// 	x: number;
// 	y: number;
// 	radius: number;
// 	speedX: number;
// 	speedY: number;
// }

// const Pong: React.FC = () => {
// 	const canvasRef = useRef<HTMLCanvasElement>(null);
// 	const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 10, y: 120, width: 10, height: 60 });
// 	const [rightPaddle, setRightPaddle] = useState<Paddle>({ x: 480, y: 120, width: 10, height: 60 });
// 	const [ball, setBall] = useState<Ball>({
// 		x: 250,
// 		y: 150,
// 		radius: 5,
// 		speedX: 0.005,
// 		speedY: 0,
// 	});
// 	const [leftScore, setLeftScore] = useState(0);
// 	const [RightScore, setRightScore] = useState(0);
// 	const [test, setTest] = useState(0);
// 	const [ballSpeed, setBallSpeed] = useState<number>(0.005);
// 	let keyPressed: Array<boolean> = new Array<boolean>(false,false,false,false);
// 	const speed:number = 15;

// 	function drawGame() {
// 		const canvas = canvasRef.current;

// 		if (canvas) {
// 			const context = canvas.getContext('2d');
			
// 			if (context) {
// 				const drawPaddles = () => {
// 					context.fillStyle = 'black';
// 					context.fillRect(0, 0, canvas.width, canvas.height);
// 					context.fillStyle = 'white';
// 					context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
// 					context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
// 				};

// 				const drawBall = () => {
// 					context.beginPath();
// 					context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
// 					context.fillStyle = 'red';
// 					context.fill();
// 					context.closePath();
// 				};
// 				const drawMiddleLine = () => {
// 					const midlleLinewidth = 2;
// 					const middleLineX = (canvas.width / 2) - (midlleLinewidth / 2);

// 					context.fillStyle = 'white';
// 					context.fillRect(middleLineX, 0, midlleLinewidth, canvas.height);
// 				};
// 				drawPaddles();
// 				drawMiddleLine();				
// 				drawBall();
// 			};
// 		}
// 	}
// 	function updateGame(ball:Ball, leftPaddle:Paddle, rightPaddle:Paddle) {
		
// 		let newBall = undefined;
// 		let NewLeftPadlle = ({...leftPaddle});
// 		let NewRightPadlle = ({...rightPaddle});

// 		if (keyPressed[0] == true)
// 			NewLeftPadlle = ({...leftPaddle, y: leftPaddle.y - speed});
// 		if (keyPressed[1] == true)
// 			NewLeftPadlle = ({...leftPaddle, y: leftPaddle.y + speed});
// 		if (keyPressed[2] == true)
// 			NewRightPadlle = ({...rightPaddle, y: rightPaddle.y - speed});
// 		if (keyPressed[3] == true)
// 			NewRightPadlle = ({...rightPaddle, y: rightPaddle.y + speed});

// 		newBall = ({...ball, x: ball.x + ball.speedX, y: ball.y + ball.speedY});
// 		return {
// 			ball: newBall,
// 			rightPaddle: NewRightPadlle,
// 			leftPaddle: NewLeftPadlle,
// 		};

// 	};
// 	drawGame();
// 	useEffect(() => {


// 		const  gameLoop = () => {
// 			const {ball: newball, rightPaddle: newRightPadlle, leftPaddle: newLeftPadlle} = updateGame(ball, rightPaddle, leftPaddle);
			
// 		setBall(newball);
// 		setRightPaddle(newRightPadlle);
// 		setLeftPaddle(newLeftPadlle);
// 		drawGame();
// 		// requestAnimationFrame(gameLoop);
// 		}
// 		const handleKeyPress = (event: KeyboardEvent) => {

// 			if (event.key === 'w') {
// 				keyPressed[0] = true;
// 			}
// 			if (event.key === 's') {
// 				keyPressed[1] = true;
// 			}
// 			if (event.key === 'ArrowUp') {
// 				keyPressed[2] = true;
// 			}
// 			if (event.key === 'ArrowDown') {
// 				keyPressed[3] = true;
// 			}
// 		};
// 		const handleKeyRelease = (event: KeyboardEvent) => {
// 			if (event.key === 'w') {
// 				keyPressed[0] = true;
// 			}
// 			if (event.key === 's') {
// 				keyPressed[1] = true;
// 			}
// 			if (event.key === 'ArrowUp') {
// 				keyPressed[2] = true;
// 			}
// 			if (event.key === 'ArrowDown') {
// 				keyPressed[3] = true;
// 			}
// 		};

// 		gameLoop();

// 		window.addEventListener('keydown', handleKeyPress);
// 		window.addEventListener('keydown', handleKeyRelease);

// 		return () => {
// 		window.removeEventListener('keydown', handleKeyPress);
// 		window.removeEventListener('keydown', handleKeyRelease);
// 		};
// 	}, [rightPaddle, leftPaddle]);

//   return (
//     <div>
// 		<p>tess</p>
//       <canvas ref={canvasRef} width={500} height={300} style={{ border: '0px solid #add8e6' }} />
//     </div>
//   );
// };

// export default Pong;


