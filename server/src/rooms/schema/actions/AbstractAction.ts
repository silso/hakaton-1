import { Schema, type } from '@colyseus/schema';
import { Player } from '../Player';
import { GameRoomState } from '../GameRoomState';
import { Validatable } from '../../core/Validatable';
import { PlayerPhase } from '../Phase';

export abstract class AbstractAction<Payload> extends Schema implements Validatable {
	@type('string') id: ActionId;
	@type(Player) player: Player;
	@type(GameRoomState) state: GameRoomState;

	payload: Payload;

	constructor(player: Player, state: GameRoomState) {
		super();
		this.player = player;
		this.state = state;
	}

	isValid(): boolean {
		if (this.payload === undefined || this.payload === null) {
			throw new Error('Action payload is undefined');
		}
		console.log('working with state', this.state.toJSON());
		if (this.state.phase instanceof PlayerPhase && this.state.phase.player !== this.player) {
			console.log('incorrect phase for this action\'s player');
			return false;
		}
		if (this.state.phase.type !== this.id) {
			console.log('incorrect phase for this action\'s type', this.id, this.state.phase.type);
			return false;
		}
		return this.doIsValid();
	}

	protected abstract doIsValid: () => boolean;

	execute(): void {
		if (this.payload === undefined && this.payload === null) {
			throw new Error('Action payload is undefined');
		} else {
			this.doExecute();
		}
	}

	protected abstract doExecute: () => void;
}

export const enum ActionId {
	Movement = 'movement-action',
	SwapTile = 'swap-tile-action',
}