/* eslint-disable */

import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Lobby } from './Pong/Lobby';
import { UsersStatusGatewayService } from 'src/users/users.gateway.service';
import { GamesService } from './Pong/Game.service';
import { GameHistoryService } from 'src/game-history/game-history.service';
import { UserStatus } from '@prisma/client';
import { Scope } from '@nestjs/common';

@WebSocketGateway({
	namespace: "/game"
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private usersStatusGatewayService: UsersStatusGatewayService,
		private gamesService: GamesService,
		private gameHistoryService: GameHistoryService) {};

	@WebSocketServer()
	server: Server;
	private lobbies: Record<string, Lobby> = {};

	handleConnection(client: Socket ) {
		client.on('joinGame', async (PaddleInfo) => {
			this.gamesService
				.isInGame(PaddleInfo.playerName)
				.then((value) => {
					if (!value) {
						if (PaddleInfo.gameMode === 'vsBot') {
							this.InitvsBotLobby(PaddleInfo, client);
						}
						if (PaddleInfo.gameMode === 'vsPlayer') {
							this.InitvsPlayerLobby(PaddleInfo, client);			
						}
						if (PaddleInfo.gameMode === 'privateGame') {
							this.InitPrivateLobby(PaddleInfo, client);
						}
					} else {
						console.log('deja en game');
						client.emit('alreadyPlay');
					}
				})
				.catch(() => console.log('Error in GameGateway.handleConnection() in this.gamesService.isInGame()'));
		})
		client.on('hookTabInfo', (hookTabInfos) => {
			let lobby = this.findUserLobby(client.id);
			if (lobby) {
				lobby.pongGame.hookTabInfo = hookTabInfos;
				lobby.pongGame.actualClient = client.id;
			}
		});		
	}

	handleDisconnect(client: any) {
        console.log("Déconnexion du client:", client.id);

		for (const lobbyID in this.lobbies) {
			for (let i = 0; i < this.lobbies[lobbyID].clients.length; i++) {
				if (client.id === this.lobbies[lobbyID].clients[i]) {
					if (this.lobbies[lobbyID].clients.length === 2 && !this.lobbies[lobbyID].pongGame.isFinished) {
						if (this.lobbies[lobbyID].clients[i] === this.lobbies[lobbyID].pongGame.leftPaddle.websocket) {
							this.lobbies[lobbyID].pongGame.loserUserId = this.lobbies[lobbyID].pongGame.leftPaddle.userId;
							this.lobbies[lobbyID].pongGame.winnerUserId = this.lobbies[lobbyID].pongGame.rightPaddle.userId;
							this.lobbies[lobbyID].pongGame.score[0] = 0;
							this.lobbies[lobbyID].pongGame.score[1] = 10;
						}
						else {
							this.lobbies[lobbyID].pongGame.loserUserId = this.lobbies[lobbyID].pongGame.rightPaddle.userId;
							this.lobbies[lobbyID].pongGame.winnerUserId = this.lobbies[lobbyID].pongGame.leftPaddle.userId;
							this.lobbies[lobbyID].pongGame.score[0] = 10;
							this.lobbies[lobbyID].pongGame.score[1] = 0;
						}
					}
					if (this.lobbies[lobbyID].pongGame.gameMode === 'vsBot') {
						this.lobbies[lobbyID].pongGame.score[0] = 5;
					}
					this.lobbies[lobbyID].clients.splice(i, 1);

					if (this.lobbies[lobbyID].clients.length === 0 || this.lobbies[lobbyID].pongGame.isFinished) {
						delete this.lobbies[lobbyID];
 					}
					break;
			}
			}
		}	
	}

	public findUserLobby(clientID: string):Lobby {
		for (const key in this.lobbies) {
			if (this.lobbies.hasOwnProperty(key)) {
				const clients = this.lobbies[key].clients;
	
				for (let i = 0; i < clients.length; i++) {
					const client = clients[i];
					if (client === clientID)
						return (this.lobbies[key]);
				}
			}
		}
	}

	public findLobbyAvailable():Lobby {
		for (const key in this.lobbies) {
			if (this.lobbies.hasOwnProperty(key) && this.lobbies[key].gameMode === 'vsPlayer' && !this.lobbies[key].isPrivate && !this.lobbies[key].pongGame.isFinished && !this.lobbies[key].pongGame.isStarted) {
				if (this.lobbies[key].clients.length === 1)
								return (this.lobbies[key]);			
			}
		}
		return (null);
	};

	public findLobbyByKey(searchKey: string): Lobby {
		for (const key in this.lobbies) {
			if (this.lobbies.hasOwnProperty(key) && this.lobbies[key].key === searchKey) {
				return (this.lobbies[key]);
			}
		}
		return (null);
	}

	public findKey(lobby: Lobby):string {
		for (const key in this.lobbies) {
			if (this.lobbies[key] === lobby)
				return (key);
		}
		return (null);
	}
	InitvsBotLobby(PaddleInfo:any, client: Socket) {
		const lobbyID: string = `vsBotLobby_${client.id}`;
		client.join(lobbyID);

		this.lobbies[lobbyID] = new Lobby('vsBot', this.server, this.usersStatusGatewayService);
		this.lobbies[lobbyID].clients[0] = client.id;
		this.lobbies[lobbyID].startGamePVE(client, PaddleInfo.gameMode);
		this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
		this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
		this.lobbies[lobbyID].pongGame.rightPaddle.avatar = "https://i.pinimg.com/originals/a5/39/07/a53907b134abfe7fdc26da8eeef1e268.jpg";
		this.lobbies[lobbyID].pongGame.rightPaddle.playerName = "BOT";
		this.lobbies[lobbyID].pongGame.leftPaddle.userId = PaddleInfo.userId;
		this.usersStatusGatewayService.updateStatus({ id: PaddleInfo.userId, status: UserStatus.PLAYING });
	};

	InitvsPlayerLobby(PaddleInfo:any, client:Socket) {
		let lobby = this.findLobbyAvailable();
		if ( lobby != null && PaddleInfo.userId === lobby.pongGame.leftPaddle.userId)
			client.emit('mirrorError');
		if (lobby != null  && PaddleInfo.userId != lobby.pongGame.leftPaddle.userId) {
			lobby.clients[1] = client.id;
			const lobbyID:string = this.findKey(lobby);
			client.join(lobbyID);
			lobby.pongGame.rightPaddle.websocket = client.id;
			lobby.pongGame.rightPaddle.avatar = PaddleInfo.avatar;
			lobby.pongGame.rightPaddle.playerName = PaddleInfo.playerName;
			lobby.pongGame.rightPaddle.userId = PaddleInfo.userId;
			lobby.startGamePVP(lobbyID, () => {
				this.gameHistoryService.addGameHistory(lobby.pongGame.winnerUserId, lobby.pongGame.winnerScore, lobby.pongGame.loserUserId, lobby.pongGame.loserScore);
			});
			// this.usersStatusGatewayService.updateStatus({ id: PaddleInfo.userId, status: UserStatus.PLAYING });
		}
		else {
			const lobbyID: string = `vsPlayerLobby_${client.id}`;
			client.join(lobbyID);
			this.lobbies[lobbyID] = new Lobby('vsPlayer', this.server, this.usersStatusGatewayService);
			this.lobbies[lobbyID].clients[0] = client.id;
			this.lobbies[lobbyID].pongGame.leftPaddle.websocket = client.id;
			this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
			this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
			this.lobbies[lobbyID].pongGame.leftPaddle.userId = PaddleInfo.userId;
			// this.usersStatusGatewayService.updateStatus({ id: PaddleInfo.userId, status: UserStatus.PLAYING });
		}
	}
	InitPrivateLobby(PaddleInfo:any, client:Socket) {
		const lobby = this.findLobbyByKey(PaddleInfo.key);
		if (lobby === null) {
			client.join(PaddleInfo.key);
			const lobbyID:string = PaddleInfo.key;
			this.lobbies[lobbyID] = new Lobby ('vsPlayer', this.server, this.usersStatusGatewayService);
			this.lobbies[lobbyID].key = PaddleInfo.key;
			this.lobbies[lobbyID].isPrivate = true;
			this.lobbies[lobbyID].clients[0] = client.id;
			this.lobbies[lobbyID].pongGame.leftPaddle.websocket = client.id;
			this.lobbies[lobbyID].pongGame.leftPaddle.userId = PaddleInfo.userId;
			this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
			this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
		} else if (lobby.pongGame.leftPaddle.userId !== PaddleInfo.userId){
			lobby.clients[1] = client.id;
			client.join(PaddleInfo.key);
			lobby.pongGame.rightPaddle.websocket = client.id;
			lobby.pongGame.rightPaddle.userId = PaddleInfo.userId;
			lobby.pongGame.rightPaddle.avatar = PaddleInfo.avatar;
			lobby.pongGame.rightPaddle.playerName = PaddleInfo.playerName;
			lobby.startGamePVP(PaddleInfo.key, () => {});
		}
	}
}