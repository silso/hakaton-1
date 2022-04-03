import { Schema, type } from '@colyseus/schema';
import { Movement } from './Movesets';
import { Pawn, Player } from './Player';

// this feels a little janky, but oh well, not sure how else to give all actions the same type
export type ActionData = {
	movement?: ConstructorParameters<typeof Movement>;
};

export abstract class Action extends Schema {
	@type('string') id = 'null-action';
	@type(Player) player = new Player();

	// payload isn't used because of the reason above
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(player: Player, payload: ActionData) {
		super();
		this.player = player;
	}

	abstract execute: () => void;
}

export class MovementAction extends Action {
	@type(Movement) movement = new Movement(0, 0);

	constructor(player: Player, payload: ActionData) {
		super(player, payload);
		this.id = ACTION_ID.MOVEMENT;
		this.movement = new Movement(...payload.movement);
	}

	execute = () => {
		if (this.player instanceof Pawn) {
			this.player.move(this.movement);
		}
	};
}

export enum ACTION_ID {
	MOVEMENT = 'movement-action',
}

// typescript typing magic to set the type of the constructor
export const ACTIONS = new Map<string, new(...args: ConstructorParameters<typeof Action>) => Action>([
	[ACTION_ID.MOVEMENT, MovementAction],
]);