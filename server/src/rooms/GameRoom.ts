import { Room, Client, updateLobby } from 'colyseus';
import { MovementAction } from './schema/Action';
import { GameRoomState } from './schema/GameRoomState';
import { Player } from './schema/Player';

export class GameRoom extends Room<GameRoomState> {

	onCreate (options: any) {
		console.log('room created.');
		this.setState(new GameRoomState());

		this.onMessage('', (client, message) => {
			//
			// handle "type" message
			//
		});

		this.onMessage('selectedAction', (client, message) => {
			this.state.players.get(client.sessionId).selectedAction = new MovementAction();
		});

		updateLobby(this);
	}

	onJoin (client: Client, options: any) {
		this.state.players.set(client.sessionId, new Player());
		console.log(client.sessionId, 'joined!');
	}

	onLeave (client: Client, consented: boolean) {
		console.log(client.sessionId, 'left!');
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
	}

}
