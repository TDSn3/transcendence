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
		console.log("Nouvelle connexion établie! client ID:", client.id);
		client.on('joinGame', async (PaddleInfo:any) => {
			if (!await this.gamesService.isInGame(PaddleInfo.playerName)) {
				if (PaddleInfo.gameMode === 'vsBot') {
					this.InitvsBotLobby(PaddleInfo, client);
				}
				if (PaddleInfo.gameMode === 'vsPlayer') {
					this.InitvsPlayerLobby(PaddleInfo, client);			
				}
				if (PaddleInfo.gameMode === 'privateGame') {
					this.InitPrivateLobby(PaddleInfo, client);
				}
			}
			else {
				console.log('deja en game');
				client.emit('alreadyPlay');
			}
		})
		client.on('hookTabInfo', (hookTabInfos:any) => {
			let lobby = this.findUserLobby(client.id);
			if (lobby) {
				lobby.pongGame.hookTabInfo = hookTabInfos;
				lobby.pongGame.actualClient = client.id;
			}
		});		
	}

	handleDisconnect(client: any) {
        console.log("Déconnexion du client:", client.id);
		// this.usersStatusGatewayService.updateStatus({ id: PaddleInfo.userId, status: UserStatus.PLAYING });

		for (const lobbyID in this.lobbies) {
			// console.log(this.lobbies[lobbyID].pongGame);
			for (let i = 0; i < this.lobbies[lobbyID].clients.length; i++) {
				if (client.id === this.lobbies[lobbyID].clients[i]) {
					console.log('coicou');
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
						console.log(this.lobbies[lobbyID].pongGame.gameMode);
						

					}
					if (this.lobbies[lobbyID].pongGame.gameMode === 'vsBot') {
						// console.log('test');
						this.lobbies[lobbyID].pongGame.score[0] = 5;
					}
					// this.usersStatusGatewayService.updateStatus({ id: this.lobbies[lobbyID].pongGame.leftPaddle.userId, status: UserStatus.ONLINE });
					this.lobbies[lobbyID].clients.splice(i, 1);

					// this.lobbies[lobbyID].pongGame.leftPaddle.userId;
					// if (this.lobbies[lobbyID].clients.length === 0 || this.lobbies[lobbyID].pongGame.isFinished) {
					// 	// clearInterval(this.lobbies[lobbyID].updateInterval);
					// 	delete this.lobbies[lobbyID];
					// 	console.log(`Lobby ${lobbyID} a ete supprime`);
					// }
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
		if (lobby != null) {
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
		if (PaddleInfo.isHost) {
			const lobbyID: string = `PrivateGame_${client.id}`;
			client.join(lobbyID);
			this.lobbies[lobbyID] = new Lobby ('vsPlayer', this.server, this.usersStatusGatewayService);
			this.lobbies[lobbyID].key = PaddleInfo.key;
			this.lobbies[lobbyID].isPrivate = true;
			this.lobbies[lobbyID].clients[0] = client.id;
			this.lobbies[lobbyID].pongGame.leftPaddle.websocket = client.id;
			this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
			this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
		}
		else {
			console.log('ici', PaddleInfo.key);
			let lobby = this.findLobbyByKey(PaddleInfo.key);
			if (lobby != null) {
				lobby.clients[1] = client.id;
				const lobbyID:string = this.findKey(lobby);
				client.join(lobbyID);
				lobby.startGamePVP(lobbyID, () => {});
				lobby.pongGame.rightPaddle.websocket = client.id;
				lobby.pongGame.rightPaddle.avatar = PaddleInfo.avatar;
				lobby.pongGame.rightPaddle.playerName = PaddleInfo.playerName;
			}
			else {
				console.log('trop tard l invitation est expire');
			}
		}
	}
}