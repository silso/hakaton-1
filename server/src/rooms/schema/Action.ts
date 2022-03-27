import { Schema, type } from '@colyseus/schema';
import { Movement } from './Movesets';
import { Pawn, Player } from './Player';

export abstract class Action extends Schema {
	@type('string') text = 'default-action';
	@type(Player) player = new Player();

	abstract execute: () => void;
}

export class MovementAction extends Action {
	@type(Movement) movement = new Movement(0, 0);
	execute = () => {
		if (this.player instanceof Pawn) {
			this.player.move(this.movement);
		}
	};
}