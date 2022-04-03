import { Schema, SetSchema, type } from '@colyseus/schema';
import { Coord, Position } from './Position';

export class Movement extends Schema {
	@type(Coord) displacement = new Coord(0, 0);

	constructor(x: number, y: number) {
		super();
		this.displacement = new Coord(x, y);
	}

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
			this.moveset.movements.add(new Movement(...pair));
		}
	}
	build(): Moveset {
		return this.moveset;
	}
}

export const CROSS = 
	new MovesetBuilder().addAll([
		[ 0,  1],
		[-1,  0], [ 1,  0],
		[ 0, -1],
	]);

export const RADIUS_1 = 
	new MovesetBuilder().addAll([
		[-1,  1], [ 0,  1], [ 1,  1],
		[-1,  0]          , [ 1,  0],
		[-1, -1], [ 0, -1], [ 1, -1],
	]);

export const RADIUS_2 = 
	new MovesetBuilder().addAll([
		[-2,  2], [-1,  2], [ 0,  2], [ 1,  2], [ 2,  2],
		[-2,  1], [-1,  1], [ 0,  1], [ 1,  1], [ 2,  1],
		[-2,  0], [-1,  0]          , [ 1,  0], [ 2,  0],
		[-2, -1], [-1, -1], [ 0, -1], [ 1, -1], [ 2, -1],
		[-2, -2], [-1, -2], [ 0, -2], [ 1, -2], [ 2, -2],
	]);

export const MOVESETS = [
	CROSS,
	RADIUS_1,
	RADIUS_2,
];