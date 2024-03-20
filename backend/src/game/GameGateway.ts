import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Lobby } from './Pong/Lobby';
import { GamesService } from './Pong/Game.service';
import { GameHistoryService } from 'src/game-history/game-history.service';

@WebSocketGateway({
	namespace: "/game"
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(private gamesService: GamesService, private gameHistoryService: GameHistoryService) {};
	@WebSocketServer()
	server: Server;
	private lobbies: Record<string, Lobby> = {};
	// private lobbies: Map<string, Lobby> = new Map<string, Lobby>;
	handleConnection(client: Socket, ...args: any[]) {
		console.log("Nouvelle connexion établie! client ID:", client.id);
		client.on('joinGame', async (PaddleInfo:any) => {
			if (!await this.gamesService.isInGame(PaddleInfo.playerName)) {
				if (PaddleInfo.gameMode === 'vsBot') {
					const lobbyID: string = `vsBotLobby_${client.id}`;
					client.join(lobbyID);

					this.lobbies[lobbyID] = new Lobby('vsBot', this.server);
					// console.log(client.id);
					this.lobbies[lobbyID].clients[0] = client.id;
					this.lobbies[lobbyID].startGamePVE(client, PaddleInfo.gameMode);
					this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
					this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
					this.lobbies[lobbyID].pongGame.rightPaddle.avatar = "https://i.pinimg.com/originals/a5/39/07/a53907b134abfe7fdc26da8eeef1e268.jpg";
					this.lobbies[lobbyID].pongGame.rightPaddle.playerName = "BOT";

				}
				if (PaddleInfo.gameMode === 'vsPlayer') {
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
							// console.log('winner', lobby.pongGame.winnerScore);
							// console.log('winnerid', lobby.pongGame.winnerUserId);
							// console.log('loser', lobby.pongGame.loserScore);
							// console.log('loserid', lobby.pongGame.loserUserId);

						});
						// lobby.startGame(lobby.clients[0], gameMode);
						// console.log(lobby.clients);
					}
					else {
						const lobbyID: string = `vsPlayerLobby_${client.id}`;
						client.join(lobbyID);
						this.lobbies[lobbyID] = new Lobby('vsPlayer', this.server);
						this.lobbies[lobbyID].clients[0] = client.id;
						this.lobbies[lobbyID].pongGame.leftPaddle.websocket = client.id;
						this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
						this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
						this.lobbies[lobbyID].pongGame.leftPaddle.userId = PaddleInfo.userId;

					}			
				}
				if (PaddleInfo.gameMode === 'privateGame') {
					if (PaddleInfo.isHost) {
						const lobbyID: string = `PrivateGame_${client.id}`;
						client.join(lobbyID);
						this.lobbies[lobbyID] = new Lobby ('vsPlayer', this.server);
						this.lobbies[lobbyID].key = PaddleInfo.key;
						this.lobbies[lobbyID].isPrivate = true;
						this.lobbies[lobbyID].clients[0] = client.id;
						this.lobbies[lobbyID].pongGame.leftPaddle.websocket = client.id;
						this.lobbies[lobbyID].pongGame.leftPaddle.avatar = PaddleInfo.avatar;
						this.lobbies[lobbyID].pongGame.leftPaddle.playerName = PaddleInfo.playerName;
						console.log('cest privee');
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
		else {
			console.log('deja en game');
			client.emit('alreadyPlay');
		}
		})		
		client.on('hookTabInfo', (hookTabInfos:any) => {
			let lobby = this.findUserLobby(client.id);
			// console.log(lobby);
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
					console.log('clients', this.lobbies[lobbyID].clients);
					console.log('paddleInfo', this.lobbies[lobbyID].pongGame.rightPaddle.websocket);
					if (this.lobbies[lobbyID].clients.length === 2 && !this.lobbies[lobbyID].pongGame.isFinished) {
						let loserId:string;
						let winnerid:string;
						if (this.lobbies[lobbyID].clients[i] === this.lobbies[lobbyID].pongGame.leftPaddle.websocket) {
							loserId = this.lobbies[lobbyID].pongGame.leftPaddle.userId;
							winnerid = this.lobbies[lobbyID].pongGame.rightPaddle.userId;
						}
						else {
							loserId = this.lobbies[lobbyID].pongGame.rightPaddle.userId;
							winnerid = this.lobbies[lobbyID].pongGame.leftPaddle.userId;
						}
						this.gameHistoryService.addGameHistory(winnerid, 10, loserId, 0);
					}
					this.lobbies[lobbyID].clients.splice(i, 1);
					clearInterval(this.lobbies[lobbyID].updateInterval);

					// console.log('le client', client.id);
					// console.log('taille du lobby' ,this.lobbies[lobbyID].clients.length)
					// console.log(this.lobbies[lobbyID].clients);
				
					if (this.lobbies[lobbyID].clients.length === 0 || this.lobbies[lobbyID].pongGame.isFinished) {
						clearInterval(this.lobbies[lobbyID].updateInterval);
						delete this.lobbies[lobbyID];
						console.log(`Lobby ${lobbyID} a ete supprime`);
					}
					break;
			}
			}
		}	
	}

	public findUserLobby(clientID: string):Lobby {
		// console.log(this.lobbies);
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
			if (this.lobbies.hasOwnProperty(key) && this.lobbies[key].gameMode === 'vsPlayer' && !this.lobbies[key].isPrivate) {
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
}