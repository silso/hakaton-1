import { Dispatcher } from '@colyseus/command';
import { Room, Client, updateLobby } from 'colyseus';
import { ExecuteActionCommand, createAction } from './command/ExecuteAction';
import { GameRoomState } from './schema/GameRoomState';
import { Player } from './schema/Player';
import { Validator } from './core/Validatable';
import { ActionPayload } from './schema/Actions';
import { AddPlayerCommand } from './command/AddPlayer';

export class GameRoom extends Room<GameRoomState> {
	private dispatcher = new Dispatcher(this);

	private getPlayer(client: Client): Player {
		return this.state.players.get(client.sessionId);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onCreate (options: unknown) {
		console.log('room created.');
		this.setState(new GameRoomState());

		this.onMessage('execute-action',
			(client, message: ActionPayload) => {
				if (!this.state.players.has(client.sessionId)) {
					client.send('invalid-session-id');
				}
				const action = createAction(this.getPlayer(client), message.actionId, this.state);
				Validator.for(action)
					.ifInvalid(() => client.send('invalid-action'))
					.ifValid(() => {
						this.dispatcher.dispatch(new ExecuteActionCommand(), {
							action: action,
							actionData: message.actionData
						});
					})
					.validate();
			}
		);

		updateLobby(this);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onJoin (client: Client, options: unknown) {
		const addPlayerCommand = new AddPlayerCommand();
		Validator.for(addPlayerCommand)
			.ifInvalid(() => {
				console.log('player cannot join', client.sessionId);
				client.send('join-failed');
			})
			.ifValid(() => {
				this.dispatcher.dispatch(addPlayerCommand, {sessionId: client.sessionId});
				console.log('player joined!', client.sessionId);
				client.send('join-succeeded');
			})
			.validate();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onLeave (client: Client, consented: boolean) {
		this.state.players.delete(client.sessionId);
		console.log(client.sessionId, 'left!');
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
		this.dispatcher.stop();
	}

}
