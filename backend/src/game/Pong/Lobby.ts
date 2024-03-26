import { Pong } from "./Pong";
import { Server, Socket } from "socket.io";
import { UsersStatusGatewayService } from 'src/users/users.gateway.service';
import { UserStatus } from '@prisma/client';




export class Lobby {
	public pongGame: Pong;
	public clients: string[];
	public updateInterval: NodeJS.Timeout | null;
	public gameMode: string;
	public server: Server;
	public isPrivate: boolean;
	public key?: string;

	constructor(gameMode:string, server:Server, private usersStatusGatewayService: UsersStatusGatewayService) {
		this.pongGame = new Pong();
		this.clients = [];
		this.updateInterval = null;
		this.gameMode = gameMode;
		this.server = server;
		this.isPrivate = false;
	}

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
					if (this.pongGame.isFinished) {
						this.usersStatusGatewayService.updateStatus({ id: this.pongGame.leftPaddle.userId, status: UserStatus.ONLINE });
						clearInterval(this.updateInterval);
					}
				}, 1000 / 60); 
			}
		}, 1000);
	}
	


	public startGamePVP(lobbyID: string, callback: () => void): void {
		this.pongGame.gameMode = 'vsPlayer';
		this.pongGame.isStarted = true;
		this.usersStatusGatewayService.updateStatus({ id: this.pongGame.leftPaddle.userId, status: UserStatus.PLAYING });
		this.usersStatusGatewayService.updateStatus({ id: this.pongGame.rightPaddle.userId, status: UserStatus.PLAYING });


	
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
					if (this.pongGame.isFinished) {
						this.usersStatusGatewayService.updateStatus({ id: this.pongGame.leftPaddle.userId, status: UserStatus.END_PLAYING });
						this.usersStatusGatewayService.updateStatus({ id: this.pongGame.rightPaddle.userId, status: UserStatus.END_PLAYING });
						clearInterval(this.updateInterval);
						callback();
					}
				}, 1000 / 60);
			}
		}, 1000);
	}

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