import { Point } from "./Point";


export class Paddle {

	public pos: Point;
	public readonly width:number;
	public readonly height:number;
	public readonly speed:number;
	public websocket?:string;

	constructor(side: "left" | "right") {
		this.width = 10;
		this.height = 60;
		this.speed = 8;

		if (side === "left")
			this.pos = new Point(0, 220);
		else if (side == "right")
			this.pos =  new Point(790, 220);
	}
};