import { Schema, type } from '@colyseus/schema';
import { Board } from './Board';

export class Coord extends Schema {
	@type('number') x = 0;
	@type('number') y = 0;

	constructor(x: number, y: number) {
		super();
		this.x = x;
		this.y = y;
	}

	toNumber(board: Board): number {
		return this.y * board.width + this.x;
	}

	static fromNumber(num: number, board: Board): Coord {
		return new Coord(Math.floor(num / board.width), num % board.width);
	}
}

export class Position extends Coord {
	add(displacement: Displacement): Position {
		return new Position(this.x + displacement.x, this.y + displacement.y);
	}
}

export class Displacement extends Coord {
}