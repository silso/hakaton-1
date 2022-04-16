import { Schema, type } from '@colyseus/schema';

export enum TileColor {
	RED = 'red',
	YELLOW = 'yellow',
	GREEN = 'green',
	BLUE = 'blue',
}

export class Tile extends Schema {
	@type('string') color = TileColor.RED;
}