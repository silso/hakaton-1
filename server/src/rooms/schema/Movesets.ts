import { Schema, SetSchema, type } from '@colyseus/schema';
import { Coord, Position } from './Position';

export class Movement extends Schema {
	@type(Coord) displacement = new Coord(0, 0);

	getNewPosition(oldPosition: Position): Position {
		return oldPosition.add(this.displacement);
	}
}

export class Moveset extends Schema {
	@type({set: Movement}) movements = new SetSchema<Movement>();
}

export class MovesetBuilder {
	private moveset: Moveset;
	addAll(pairs: [number, number][]) {
		for (const pair of pairs) {
			this.moveset.movements.add(new Movement(pair));
		}
	}
	build(): Moveset {
		return this.moveset;
	}
}

export const RADIUS_1 = 
	new MovesetBuilder().addAll([
		[-1,  1], [ 0,  1], [ 1,  1],
		[-1,  0], [ 0,  0], [ 1,  0],
		[-1, -1], [ 0, -1], [ 1, -1],
	]);

export const MOVESETS = [
	RADIUS_1,
];