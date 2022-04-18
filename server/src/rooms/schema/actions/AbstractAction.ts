import { Schema, type } from '@colyseus/schema';
import { Player } from '../Player';
import { GameRoomState } from '../GameRoomState';
import { Validatable } from '../../core/Validatable';

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
		if (this.state.phase.player !== this.player) {
			// incorrect phase for this action's player
			return false;
		}
		if (this.state.phase.type !== this.id) {
			// incorrect phase for this action's type
			return false;
		}
		return this.doIsValid();
	}

	protected abstract doIsValid: () => boolean;

	execute(): void {
		if (this.payload !== undefined && this.payload !== null) {
			this.doExecute();
		} else {
			throw new Error('Action not initialized');
		}
	}

	protected abstract doExecute: () => void;
}

export enum ActionId {
	Movement = 'movement-action',
	SwapTile = 'swap-tile-action',
}