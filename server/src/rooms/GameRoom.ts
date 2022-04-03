import { Dispatcher } from '@colyseus/command';
import { Room, Client, updateLobby } from 'colyseus';
import { LockInCommand as LockInCommand, SelectActionCommand } from './command/Turn';
import { GameRoomState } from './schema/GameRoomState';
import { Player } from './schema/Player';

export class GameRoom extends Room<GameRoomState> {
	dispatcher = new Dispatcher(this);

	private getPlayer(client: Client) {
		return this.state.players.get(client.sessionId);
	}

	onCreate (options: any) {
		console.log('room created.');
		this.setState(new GameRoomState());

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.onMessage('selectAction', (client, message) => {
			// this will tell the server to select an action according to the actionId and with the actionData
			// this can end up just being bundled with the LockInCommand, and probably will be. But that shouldn't
			// be a bad change at all.
			this.dispatcher.dispatch(new SelectActionCommand(), {
				player: this.getPlayer(client),
				actionId: message.actionId,
				actionData: message.actionData
			});
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.onMessage('lock-in', (client, message: string) => {
			this.dispatcher.dispatch(new LockInCommand(), {
				player: this.getPlayer(client)
			});
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
		this.dispatcher.stop();
	}

}
