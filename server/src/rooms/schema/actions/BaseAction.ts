import { Schema, type } from '@colyseus/schema';
import { Player } from '../Player';

export abstract class BaseAction<Payload> extends Schema {
	@type('string') id = 'null-action';
	@type(Player) player: Player;

	payload: Payload;

	constructor(player: Player) {
		super();
		this.player = player;
	}

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
	Test = 'test-action',
}