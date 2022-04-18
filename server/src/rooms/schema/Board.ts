import { Schema, type } from '@colyseus/schema';
import { Validatable } from '../core/Validatable';
import { Moveset, MovesetBuilder } from './Movesets';
import { Tile, TileColor } from './Tile';

export class Board extends Schema implements Validatable {
	@type('number') width = 4;
	@type('number') height = 4;
	@type([Tile]) tiles: Tile[] = [];

	tileMovesets: Map<TileColor, Moveset>;
	
	constructor(width: number, height: number) {
		super();
		this.width = width;
		this.height = height;
		this.tileMovesets = new Map<TileColor, Moveset>([
			[TileColor.Red, new MovesetBuilder(this).addAll([[2, 0], [0, 2], [-2, 0], [0, -2]]).build()],
			[TileColor.Yellow, new MovesetBuilder(this).addAll([[1, 2], [2, -1], [-1, -2], [-2, 1]]).build()],
			[TileColor.Green, new MovesetBuilder(this).addAll([[-1, 2], [2, 1], [1, -2], [-2, -1]]).build()],
			[TileColor.Blue, new MovesetBuilder(this).addAll([[2, 2], [-2, 2], [-2, -2], [2, -2]]).build()],
		]);
	}

	isValid(): boolean {
		return true;
	}
}