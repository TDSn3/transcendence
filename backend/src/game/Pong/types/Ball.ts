import { Point } from "./Point";
import { Paddle } from "./Paddle";

export class Ball {
	pos: Point;
	speedX: number;
	speedY: number;
	angle: number;

	constructor(CanWidth: number, CanHeight: number) {
		this.pos = new Point(CanWidth / 2, CanHeight / 2);
		this.angle = (-Math.PI/4 + (Math.random() * ((Math.PI/4) -  (-Math.PI/4))));
		this.speedX = (Math.random() > 0.5 ? 5 * Math.cos(this.angle) : 5 * -Math.cos(this.angle));
		this.speedY = 5 * Math.sin(this.angle);
		// this.speedY = 0;
		// this.speedX = 3;
	}



};