import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Lobby } from './Pong/Lobby';

@WebSocketGateway({
	namespace: "/game"
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;
	private lobbies: Record<string, Lobby> = {};
	// private lobbies: Map<string, Lobby> = new Map<string, Lobby>;
	handleConnection(client: Socket, ...args: any[]) {
		console.log("Nouvelle connexion établie! client ID:", client.id);

		client.on('joinGame', (PaddleInfo:any) => {
			if (PaddleInfo.gameMode === 'vsBot') {
				console.log('Contre le bot');
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
					lobby.startGamePVP(lobbyID);
					lobby.pongGame.rightPaddle.websocket = client.id;
					lobby.pongGame.rightPaddle.avatar = PaddleInfo.avatar;
					lobby.pongGame.rightPaddle.playerName = PaddleInfo.playerName;
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

				}			
			}
		})		
		client.on('hookTabInfo', (hookTabInfos:any) => {
			let lobby = this.findUserLobby(client.id);
			// console.log(lobby);
			lobby.pongGame.hookTabInfo = hookTabInfos;
			lobby.pongGame.actualClient = client.id;
		});		
	}
	handleDisconnect(client: any) {
        console.log("Déconnexion du client:", client.id);
		for (const lobbyID in this.lobbies) {
			for (let i = 0; i < this.lobbies[lobbyID].clients.length; i++) {
				if (client.id === this.lobbies[lobbyID].clients[i]) {
					// delete this.lobbies[lobbyID].clients[i];
					this.lobbies[lobbyID].clients.splice(i, 1);
					// console.log('le client', client.id);
					// console.log('taille du lobby' ,this.lobbies[lobbyID].clients.length)
					// console.log(this.lobbies[lobbyID].clients);
				
					if (this.lobbies[lobbyID].clients.length === 0) {
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
				// if (clients === clientID)
				// console.log(clients[0]);
	
				for (let i = 0; i < clients.length; i++) {
					const client = clients[i];
					if (client === clientID)
						// console.log("FOIEWGII");
						return (this.lobbies[key]);
				}
			}
		}
	}

	public findLobbyAvailable():Lobby {
		for (const key in this.lobbies) {
			if (this.lobbies.hasOwnProperty(key) && this.lobbies[key].gameMode === 'vsPlayer') {
				if (this.lobbies[key].clients.length === 1)
								return (this.lobbies[key]);			
			}
		}
	return (null);
	};

	public findKey(lobby: Lobby):string {
		for (const key in this.lobbies) {
			if (this.lobbies[key] === lobby)
				return (key);
		}
		return (null);
	}
}