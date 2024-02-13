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
const Pong: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [leftPaddle, setLeftPaddle] = useState<Paddle>({ x: 10, y: 120, width: 10, height: 60 });
	const [rightPaddle, setRightPaddle] = useState<Paddle>({ x: 480, y: 120, width: 10, height: 60 });
	const [ball, setBall] = useState<Ball>({
		x: 250,
		y: 150,
		radius: 5,
		speedX: 0.005,
		speedY: 0,
	});
	const [leftScore, setLeftScore] = useState(0);
	const [RightScore, setRightScore] = useState(0);
	const [test, setTest] = useState(0);
	const [ballSpeed, setBallSpeed] = useState<number>(0.005);


	useEffect(() => {
		const canvas = canvasRef.current;

		if (canvas) {
			const context = canvas.getContext('2d');

			if (context) {
				const drawPaddles = () => {
					// const backgroundImage = new Image();
					// backgroundImage.src = 'https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/0/0/b/00bc623b1c_50080254_691-illusions-canonique.jpg';
					// backgroundImage.onload = () => {
					// context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        			context.fillStyle = 'black';
        			context.fillRect(0, 0, canvas.width, canvas.height);
        				context.fillStyle = 'white';
        				context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        				context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
					// }s
        		};

				const handleKeyPress = (event: KeyboardEvent) => {
        			const speed: number = 15; 

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
						speedX: 0.005,
						speedY: 0.005,
					});
				};
			// Augmenter le score
				if (ball.x - ball.radius < 0) {
					setRightScore((prev) => prev + 1);
					resetBall();
					setBallSpeed(0.005);
				}
				if (ball.x + ball.radius > canvas.width) {
					setLeftScore((prev) => prev + 1);
					resetBall();
					setBallSpeed(0.005);
				}

			//Rebond terrain
				if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
					setBall((prev) => ({...prev, speedY: -prev.speedY}));
				if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
					setBall((prev) => ({...prev, speedX: -prev.speedX}));

			// Rebond raquette
				if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
					let relativePosition = (ball.y - leftPaddle.y) / leftPaddle.height;
					if (relativePosition > 0.75)
						relativePosition = 0.75;
					const angle = (relativePosition - 0.5) * Math.PI;
					const speed = Math.sqrt(ballSpeed ** 2 + ball.speedY ** 2);
					const directionX = Math.cos(angle);
					const directiony = Math.sin(angle);
				
					setBall((prev) => ({
						...prev,
						x:leftPaddle.x + leftPaddle.width + prev.radius ,
						speedX: directionX * speed,
						speedY: directiony * speed,
					}));
					// setBallSpeed(ballSpeed + 0.001);
				}
				if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height){
					let relativePosition = (ball.y - rightPaddle.y) / rightPaddle.height;
					if (relativePosition > 0.75)
						relativePosition = 0.75;
					const angle = (relativePosition - 0.5) * Math.PI;
					const speed = Math.sqrt(ballSpeed ** 2 + ball.speedY ** 2);
					const directionX = -Math.cos(angle);
					const directiony = Math.sin(angle);
				
					setBall((prev) => ({
						...prev,
						x: rightPaddle.x - prev.radius ,
						speedX: directionX * speed,
						speedY: directiony * speed,
					}));
					// setBallSpeed(ballSpeed + 0.001);
				}

				const drawMiddleLine = () => {
					const midlleLinewidth = 2;
					const middleLineX = (canvas.width / 2) - (midlleLinewidth / 2);

					context.fillStyle = 'white';
					context.fillRect(middleLineX, 0, midlleLinewidth, canvas.height);
				}
    			const drawGame = () => {
					drawPaddles();
					updateBall();
					drawMiddleLine();
					drawBall();
					context.fillStyle = 'white';
					context.font = '20px Arial';
					context.fillText(`${leftScore}`, canvas.width / 2 - 30, 30);
					context.fillText(`${RightScore}`, canvas.width / 2 + 20, 30);
        		};

        		const gameLoop = () => {
					drawGame();
					if (ball.speedX == 0)
						console.log(ball.speedX);
        			// requestAnimationFrame(gameLoop);
      			};

        		gameLoop();


        		window.addEventListener('keydown', handleKeyPress);

				return () => {
        			window.removeEventListener('keydown', handleKeyPress);
        		};
      		}
    	}
  }, [leftPaddle, rightPaddle, ball]);

	

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={300} style={{ border: '0px solid #add8e6' }} />
    </div>
  );
};

export default Pong;


