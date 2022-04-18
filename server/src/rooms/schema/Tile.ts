import { Schema, type } from '@colyseus/schema';

export enum TileColor {
	Red = 'red',
	Yellow = 'yellow',
	Green = 'green',
	Blue = 'blue',
}

export class Tile extends Schema {
	@type('string') color = TileColor.Red;

	constructor({color}: {color: TileColor}) {
		super();
		this.color = color;
	}
}