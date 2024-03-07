import { Ball } from "./types/Ball";
import { Paddle } from "./types/Paddle";

export class Pong {

	public isStarted: boolean = false;
	public isFinished: boolean = false;

	public gameMode: string;

	public readonly width: number = 800;
	public readonly height: number = 500;

	public ball: Ball =  new Ball(800, 480);

	public leftPaddle:Paddle = new Paddle("left");
	public rightPaddle:Paddle = new Paddle("right");

	public hookTabInfo:any[] = [false, false];

	public score:number[] = [0,0];


	public loop() {
		while (1)
			this.nextFrame();
	};

	public nextFrame() {
		if (!this.isFinished) {
			this.updateBall();
			this.updatePaddles();
			this.updateScore();
		}
	};

	public updatePaddles() {
		if (this.gameMode === 'vsBot') {

			const botSpeed = 5;
			const targetY = this.ball.pos.y - this.rightPaddle.height / 2;

			if (Math.abs(this.rightPaddle.pos.y - targetY) < botSpeed) {
				this.rightPaddle.pos.y = targetY;
			}
			else {
				if (this.rightPaddle.pos.y < targetY) {
					this.rightPaddle.pos.y += botSpeed;
				} else if (this.rightPaddle.pos.y > targetY) {
					this.rightPaddle.pos.y -= botSpeed;
				}
			}
		}
		if (this.hookTabInfo) {
			// if (this.hookTabInfo[0] || this.hookTabInfo[1])
			// console.log('#IN_PONG', this.hookTabInfo);
			let move = 0;
			if (this.hookTabInfo[0] && this.leftPaddle.pos.y + (this.leftPaddle.height / 2) > 0)
				move -= 6;
			if (this.hookTabInfo[1] && this.leftPaddle.pos.y + this.leftPaddle.height  - (this.leftPaddle.height / 2) < this.height)
				move += 6;
			this.leftPaddle.pos.y += move;
		}
	};

	private updateBall() {
		if (this.ball.pos.y + 5 > this.height)
			this.ball.speedY *= -1;
		else if (this.ball.pos.y - 5 < 0)
		this.ball.speedY *= -1;


		if (this.ball.pos.x - 5 < this.leftPaddle.width && this.ball.pos.y > this.leftPaddle.pos.y && this.ball.pos.y < this.leftPaddle.pos.y + this.leftPaddle.height) {
			let relativePosition = (this.ball.pos.y - this.leftPaddle.pos.y) / this.leftPaddle.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			const angle = (relativePosition - 0.5) * Math.PI;
			let speed = Math.sqrt(this.ball.speedX ** 2 + this.ball.speedY ** 2);
			const directionX = Math.cos(angle);
			const directionY = Math.sin(angle);
			
			speed *= 1.05;
			if (speed > 20)
				speed = 20;
			this.ball.speedX = directionX * speed;
			this.ball.speedY = directionY * speed;
		}
		if (this.ball.pos.x + 5 > this.rightPaddle.pos.x && this.ball.pos.y > this.rightPaddle.pos.y && this.ball.pos.y < this.rightPaddle.pos.y + this.rightPaddle.height) {
			let relativePosition = (this.ball.pos.y - this.rightPaddle.pos.y) / this.rightPaddle.height;
			if (relativePosition > 0.66)
				relativePosition = 0.66;
			const angle = (relativePosition - 0.5) * Math.PI;
			let speed = Math.sqrt(this.ball.speedX ** 2 + this.ball.speedY ** 2);
			const directionX = -Math.cos(angle);
			const directionY = Math.sin(angle);
			
			speed *= 1.05;
			if (speed > 20)
				speed = 20;
			this.ball.speedX = directionX * speed;
			this.ball.speedY = directionY * speed;
		}

		this.ball.pos.x += this.ball.speedX;
		this.ball.pos.y += this.ball.speedY;
	};

	private resetBall(speedX:number) {
		this.ball.pos.x = this.width / 2;
		this.ball.pos.y = this.height / 2;
		this.ball.speedX = speedX;
		this.ball.speedY = 0;	
	}

	private updateScore () {
		if (this.ball.pos.x - 5 < 0 && !(this.ball.pos.y > this.leftPaddle.pos.y && this.ball.pos.y < this.leftPaddle.pos.y + this.leftPaddle.height)) {
			this.score[1]++;
			this.resetBall(-5);
		}
		if (this.ball.pos.x + 5 > this.width && !(this.ball.pos.y > this.rightPaddle.pos.y && this.ball.pos.y < this.rightPaddle.pos.y + this.rightPaddle.height)) {
			this.score[0]++;
			this.resetBall(5);
		}
		if (this.score[0] === 5 || this.score[1] === 5)
			this.isFinished = true;
	}

	public LeftPaddleMoveUp () {
		if (this.leftPaddle.pos.y - 5 > 0)
			this.leftPaddle.pos.y -= this.leftPaddle.speed;
	}

	public LeftPaddleMoveDown () {
		if (this.leftPaddle.pos.y + this.leftPaddle.height + 5 < this.height)
			this.leftPaddle.pos.y += this.leftPaddle.speed;
	}

}