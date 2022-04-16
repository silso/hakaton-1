import { Schema, type } from '@colyseus/schema';
import { Validatable } from '../core/Validatable';
import { Board } from './Board';
import { Movement } from './Movesets';
import { Position } from './Position';
import { Tile } from './Tile';

export class Player extends Schema implements Validatable {
	@type('string') name = 'default-name';
	@type(Position) position = new Position(0, 0);
	@type(Tile) ownedTile: Tile;

	constructor(private board: Board) {
		super();
	}

	isValid() {
		return true;
	}

	move(movement: Movement) {
		this.position = this.position.add(movement.displacement);
	}
}