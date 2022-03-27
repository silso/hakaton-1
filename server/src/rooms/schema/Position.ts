import { Schema, type } from '@colyseus/schema';

export class Coord extends Schema {
	@type('number') x = 0;
	@type('number') y = 0;
}

export class Position extends Coord {
	add(displacement: Displacement): Position {
		return new Position(this.x + displacement.x, this.y + displacement.y);
	}
}

export class Displacement extends Coord {
}