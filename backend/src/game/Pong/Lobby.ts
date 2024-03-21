import { Pong } from "./Pong";
import { Server, Socket } from "socket.io";


export class Lobby {
	public pongGame: Pong;
	public clients: string[];
	public updateInterval: NodeJS.Timeout | null;
	public gameMode: string;
	public server: Server;
	public isPrivate: boolean;
	public key?: string;

	constructor(gameMode:string, server:Server) {
		this.pongGame = new Pong();
		this.clients = [];
		this.updateInterval = null;
		this.gameMode = gameMode;
		this.server = server;
		this.isPrivate = false;
	}

	// public startGamePVE(client: Socket, gameMode:string): void {
	// 	this.pongGame.gameMode =  gameMode;

	// 	this.updateInterval = setInterval(() => {
	// 		this.pongGame.nextFrame();
	// 		this.sendGameInfo(client, gameMode);
	// 	}, 1000/60);
	// }

	public startGamePVE(client: Socket, gameMode: string): void {
		this.pongGame.gameMode =  gameMode;
		const countdownInterval = setInterval(() => {
			if (this.pongGame.countdown > 0) {
				this.sendGameInfo(client, gameMode);
				this.pongGame.countdown--;
			} else {
				clearInterval(countdownInterval);
				this.pongGame.timerStart = Date.now();
				this.updateInterval = setInterval(() => {
					this.pongGame.nextFrame();
					this.sendGameInfo(client, gameMode);
				
				}, 1000 / 60); 
			}
		}, 1000);
	}
	


	public startGamePVP(lobbyID: string, callback: () => void): void {
		this.pongGame.gameMode = 'vsPlayer';
	
		const countdownInterval = setInterval(() => {
			if (this.pongGame.countdown > 0) {
				this.sendGameInfoRoom(lobbyID);
				this.pongGame.countdown--;
			} else {
				clearInterval(countdownInterval);
				this.pongGame.timerStart = Date.now();
				this.updateInterval = setInterval(() => {
					this.pongGame.nextFrame();
					this.sendGameInfoRoom(lobbyID);
					// console.log('TEST', this.pongGame.isFinished);
					if (this.pongGame.isFinished) {
						clearInterval(this.updateInterval);
						console.log('coucou');
						callback();
					}
				}, 1000 / 60);
			}
		}, 1000);
	}

	// public startGamePVP(lobbyID:string): void {
	// 	this.pongGame.gameMode = 'vsPlayer';
	
	// 	// this.sendGameInfo(client, gameMode);
	// 	const countdownInterval = setInterval(() => {
	// 		if (this.pongGame.countdown > 0) {
	// 			this.sendGameInfoRoom(lobbyID);
	// 			this.pongGame.countdown--;
	// 		} else {
	// 			clearInterval(countdownInterval);
	// 			this.pongGame.timerStart = Date.now();
	// 			this.updateInterval = setInterval(() => {
	// 				this.pongGame.nextFrame();
	// 				this.sendGameInfoRoom(lobbyID);
	// 			}, 1000 / 60); 
	// 		}
	// 	}, 1000);
	// }

	// public startGamePVP(lobbyID:string): void {

	// 	this.pongGame.gameMode = 'vsPlayer';

	// 	this.updateInterval = setInterval(() => {
	// 		this.pongGame.nextFrame();
	// 		this.sendGameInfoRoom(lobbyID);
	// 	}, 1000/60);
	// }

	

	private sendGameInfo(client: Socket, gameMode?: string) {
		const gameInfo = {
			width: this.pongGame.width,
			height: this.pongGame.height,
			ball: this.pongGame.ball,
			leftPaddle: this.pongGame.leftPaddle,
			rightPaddle: this.pongGame.rightPaddle,
			score: this.pongGame.score,
			gameMode: gameMode,
			countdown: this.pongGame.countdown,
			timeLeft: this.pongGame.timeLeft,
		}
		client.emit('gameInfo', gameInfo);
	  };

	  private sendGameInfoRoom(lobbyId: string) {
		const gameInfo = {
			width: this.pongGame.width,
			height: this.pongGame.height,
			ball: this.pongGame.ball,
			leftPaddle: this.pongGame.leftPaddle,
			rightPaddle: this.pongGame.rightPaddle,
			score: this.pongGame.score,
			gameMode : 'vsPlayer',
			countdown: this.pongGame.countdown,
			timeLeft: this.pongGame.timeLeft,
		}
		this.server.to(lobbyId).emit('gameInfo', gameInfo)
	}
}