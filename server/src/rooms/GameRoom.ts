import { Room, Client, updateLobby } from 'colyseus';
import { MovementAction } from './schema/Action';
import { GameRoomState } from './schema/GameRoomState';
import { Player } from './schema/Player';

export class GameRoom extends Room<GameRoomState> {

	private getPlayer(client: Client) {
		return this.state.players.get(client.sessionId);
	}

	onCreate (options: any) {
		console.log('room created.');
		this.setState(new GameRoomState());

		this.onMessage('', (client, message) => {
			//
			// handle "type" message
			//
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.onMessage('selectAction', (client, message) => {
			this.getPlayer(client).selectedAction = new MovementAction();
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.onMessage('getReady', (client, message) => {
			this.getPlayer(client).ready = true;
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
