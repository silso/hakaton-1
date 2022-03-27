import { LobbyRoom, Server } from 'colyseus';
import { GameRoom } from './rooms/GameRoom';
const PORT = 2567;

const gameServer = new Server();

gameServer.define('lobby', LobbyRoom);
gameServer.define('game-room', GameRoom).enableRealtimeListing();

gameServer.listen(PORT);