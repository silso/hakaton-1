import { Schema, type } from '@colyseus/schema';
import { Action } from './Action';
import { Movement } from './Movesets';
import { Position } from './Position';

export class Player extends Schema {
	@type('string') name = 'default-name';
	@type('boolean') ready = false;
	@type(Action) selectedAction: Action;
}

export class Pawn extends Player {
	@type(Position) position = new Position(0, 0);

	move(movement: Movement) {
		this.position = movement.getNewPosition(this.position);
	}
}

export class Overlord extends Player {

}