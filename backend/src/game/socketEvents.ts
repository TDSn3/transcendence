import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Pong } from "./Pong/Pong";
@WebSocketGateway({
  namespace: "/game",
  cors: {
    origin: '*',
	
  },
})
export class SocketEvents {
  @WebSocketServer()
  server: Server;

  private lobbies: Record<string, string[]> = {};
  public pongGame: Pong = new Pong();
  private updateInterval;

  handleConnection(client: Socket) {
    try {
      console.log("Nouvelle connexion établie! client ID:", client.id);
	  client.on('joinlobby', (lobbyID: string) => {
		if (!this.lobbies[lobbyID] || this.lobbies[lobbyID].length < 2) {
		client.join(lobbyID);

		this.lobbies[lobbyID] = this.lobbies[lobbyID] || [];
		this.lobbies[lobbyID].push(client.id);

		console.log(`Client ${client.id} a rejoint le lobby ${lobbyID}`)
		if (this.lobbies[lobbyID].length === 2) {
			console.log(`Le lobby ${lobbyID} est prêt à démarrer le jeu.`);
			this.server.to(lobbyID).emit('startGame');
		}
		}
		else {
			console.log(`Le lobby ${lobbyID} est complet. Impossible de rejoindre.`);
			this.server.to(client.id).emit('lobbyIsFull');
		}
	  });
	  client.on('joinGame', (gameMode: string) => {
			if (gameMode === 'vsBot') {
				console.log('Contre un robot')
				this.pongGame.gameMode = 'vsBot';
				this.sendGameInfo(client, gameMode);

				this.updateInterval = setInterval(() => {
					this.pongGame.nextFrame();
					this.sendGameInfo(client);

				}, 1000 / 60);
			}
			else if (gameMode === 'vsPlayer') {
				console.log('Contre un joueur');
				this.pongGame.gameMode = 'vsPlayer';
				const lobbyID:string = 'vsPlayerLobby';
				client.join(lobbyID);
				this.lobbies[lobbyID] = this.lobbies[lobbyID] || [];
				this.lobbies[lobbyID].push(client.id);
				if (!this.pongGame.leftPaddle.websocket)
					this.pongGame.leftPaddle.websocket = client.id;
				else
					this.pongGame.rightPaddle.websocket = client.id;

				console.log(`Client ${client.id} a join le lobby ${lobbyID}`);

				if (this.lobbies[lobbyID].length === 2) {
					console.log(`le lobby ${lobbyID} est pret a dema `)
					this.server.to(lobbyID).emit('startPVPGame');
					this.SendGameInfoRoom(lobbyID);
					this.updateInterval = setInterval(() => {
						this.pongGame.nextFrame();
						this.SendGameInfoRoom(lobbyID);
	
					}, 1000 / 60);
				}

			}


		});
	client.on('hookTabInfo', (hookTabInfos:any) => {
		this.pongGame.hookTabInfo = hookTabInfos;
		this.pongGame.actualClient = client.id;
	});
      client.on('disconnect', () => {
        console.log("Déconnexion du client:", client.id);
		clearInterval(this.updateInterval);
		this.pongGame = new Pong();
		for (const lobbyID in this.lobbies) {
			this.lobbies[lobbyID] = this.lobbies[lobbyID].filter(id => id !== client.id);
			if (this.lobbies[lobbyID].length === 0) {
			  delete this.lobbies[lobbyID];
			  console.log(`Le lobby ${lobbyID} a été supprimé car il est maintenant vide.`);
			}
		}
      });
    } catch (error) {
      console.error("Erreur lors de la gestion de la connexion :", error);
      client.emit('error', 'Une erreur est survenue lors de la connexion');
      client.disconnect(true);
    }
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
	}
	client.emit('gameInfo', gameInfo);
  }
  
  private SendGameInfoRoom(lobbyId: string) {
	const gameInfo = {
		width: this.pongGame.width,
		height: this.pongGame.height,
		ball: this.pongGame.ball,
		leftPaddle: this.pongGame.leftPaddle,
		rightPaddle: this.pongGame.rightPaddle,
		score: this.pongGame.score,
	}
	// console.log(gameInfo);
	this.server.to(lobbyId).emit('gameInfo', gameInfo)
}

}
