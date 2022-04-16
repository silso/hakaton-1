import { Dispatcher } from '@colyseus/command';
import { Room, Client, updateLobby } from 'colyseus';
import { ExecuteActionCommand } from './command/Turn';
import { GameRoomState } from './schema/GameRoomState';
import { Player } from './schema/Player';

export class GameRoom extends Room<GameRoomState> {
	dispatcher = new Dispatcher(this);

	private getPlayer(client: Client): Player {
		return this.state.players.get(client.sessionId);
	}

	onCreate (options: any) {
		console.log('room created.');
		this.setState(new GameRoomState());

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.onMessage('execute-action', (client, message) => {
			console.log('received execute-action', message);
			const oldState = this.state.clone();
			this.dispatcher.dispatch(new ExecuteActionCommand(), {
				player: this.getPlayer(client),
				action: message
			});
			if (!this.state.isValid()) {
				console.log('invalid state, rolling back');
				// rollback and give feedback somehow
				this.setState(oldState);
			}
			console.log('successful execute-action');
		});

		updateLobby(this);
	}

	onJoin (client: Client, options: any) {
		this.state.players.set(client.sessionId, new Player(this.state.board));
		console.log(client.sessionId, 'joined!');
	}

	onLeave (client: Client, consented: boolean) {
		console.log(client.sessionId, 'left!');
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
		this.dispatcher.stop();
	}

}
