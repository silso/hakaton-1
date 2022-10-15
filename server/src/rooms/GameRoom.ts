import { Dispatcher } from '@colyseus/command';
import { Room, Client, updateLobby } from 'colyseus';
import { ExecuteActionCommand } from './command/ExecuteAction';
import { GameRoomState } from './schema/GameRoomState';
import { Player } from './schema/Player';
import { Validator } from './core/Validatable';
import { AddPlayerCommand } from './command/AddPlayer';
import { Movement } from './schema/Movesets';
import { MovementAction } from './schema/actions/Movement';
import { MessageType } from '@shared/actions';
import { Tile } from './schema/Tile';
import { SwapTileAction } from './schema/actions/SwapTile';

export class GameRoom extends Room<GameRoomState> {
	private dispatcher = new Dispatcher(this);

	private getPlayer(client: Client): Player {
		return this.state.players.get(client.sessionId);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onCreate (options: unknown) {
		console.log('\nroom created.');
		this.setState(new GameRoomState());

		this.onMessage(MessageType.Movement, (client, message: Movement) => {
			if (!this.state.players.has(client.sessionId)) {
				client.send('invalid-session-id');
			}
			const action = new MovementAction(this.getPlayer(client), this.state);
			action.payload = message;
			Validator.for(action)
				.ifInvalid(() => {
					console.log('invalid-action', action.id);
					client.send('invalid-action');
				})
				.ifValid(() => {
					console.log('execute-action is valid');
					this.dispatcher.dispatch(new ExecuteActionCommand(), {action});
				})
				.validate();
		});

		this.onMessage(MessageType.SwapTile, (client, message: Tile) => {
			if (!this.state.players.has(client.sessionId)) {
				client.send('invalid-session-id');
			}
			const action = new SwapTileAction(this.getPlayer(client), this.state);
			action.payload = message;
			Validator.for(action)
				.ifInvalid(() => {
					console.log('invalid-action', action.id);
					client.send('invalid-action');
				})
				.ifValid(() => {
					console.log('execute-action is valid');
					this.dispatcher.dispatch(new ExecuteActionCommand(), {action});
				})
				.validate();
		});

		this.onMessage('test-message', 
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(client, message) => {
				console.log('received test-message');
				this.state.testNumber++;
			}
		);
		
		updateLobby(this);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onJoin (client: Client, options: unknown) {
		const addPlayerCommand = new AddPlayerCommand();
		addPlayerCommand.state = this.state;
		Validator.for(addPlayerCommand)
			.ifInvalid(() => {
				console.log('player cannot join', client.sessionId);
				client.send('join-failed');
			})
			.ifValid(() => {
				this.dispatcher.dispatch(addPlayerCommand, {sessionId: client.sessionId});
				console.log(client.sessionId, 'has joined!');
				console.log('Current number of players: ', this.state.players.size);
				client.send('join-succeeded', client.sessionId);
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
