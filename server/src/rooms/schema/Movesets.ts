import { Schema, SetSchema, type } from '@colyseus/schema';
import { Board } from './Board';
import { Coord, Position } from './Position';

export class Movement extends Schema {
	@type(Coord) displacement = new Coord(0, 0);

	constructor({x, y}: {x: number, y: number}) {
		super();
		this.displacement = new Coord(x, y);
	}

	getNewPosition(oldPosition: Position): Position {
		return oldPosition.add(this.displacement);
	}

	toNumber(board: Board): number {
		return this.displacement.toNumber(board);
	}

	static fromNumber(num: number, board: Board): Movement {
		return new Movement(Coord.fromNumber(num, board));
	}
}

export class Moveset extends Schema {
	@type({set: 'number'}) movements = new SetSchema<number>();
}

export class MovesetBuilder {
	private moveset = new Moveset();
	constructor(private board: Board){}
	addAll(pairs: [number, number][]) {
		for (const pair of pairs) {
			this.moveset.movements.add((new Movement({x: pair[0], y: pair[1]})).toNumber(this.board));
		}
		return this;
	}
	build(): Moveset {
		return this.moveset;
	}
}