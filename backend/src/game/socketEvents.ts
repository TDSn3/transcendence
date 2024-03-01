import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
//   path: "/game"/
  cors: {
    origin: '*',
  },
})
export class SocketEvents {
  @WebSocketServer()
  server: Server;

  private lobbies: Record<string, string[]> = {};

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
      // Listen for the disconnect event
      client.on('disconnect', () => {
        console.log("Déconnexion du client:", client.id);
		for (const lobbyID in this.lobbies) {
			this.lobbies[lobbyID] = this.lobbies[lobbyID].filter(id => id !== client.id);
			if (this.lobbies[lobbyID].length === 0) {
			  delete this.lobbies[lobbyID];
			  console.log(`Le lobby ${lobbyID} a été supprimé car il est maintenant vide.`);
			}
		}
        // Your disconnection handling logic here
      });
    } catch (error) {
      console.error("Erreur lors de la gestion de la connexion :", error);
      // You can also emit an error message to the client if necessary
      client.emit('error', 'Une erreur est survenue lors de la connexion');
      // Optionally, disconnect the client if a critical error is detected
      client.disconnect(true);
    }
  }
}
