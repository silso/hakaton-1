import { Schema, type } from '@colyseus/schema';
import { Validatable } from '../core/Validatable';
import { Moveset, MovesetBuilder } from './Movesets';
import { Tile, TileColor } from './Tile';

export class Board extends Schema implements Validatable {
	@type('number') width = 6;
	@type('number') height = 6;
	@type([Tile]) tiles: Tile[] = [];

	tileMovesets: Map<TileColor, Moveset>;
	
	constructor(width: number, height: number) {
		super();
		this.width = width;
		this.height = height;
		this.tileMovesets = new Map<TileColor, Moveset>([
			[TileColor.RED, new MovesetBuilder(this).addAll([[2, 0], [0, 2], [-2, 0], [0, -2]]).build()],
			[TileColor.YELLOW, new MovesetBuilder(this).addAll([[1, 2], [2, -1], [-1, -2], [-2, 1]]).build()],
			[TileColor.GREEN, new MovesetBuilder(this).addAll([[-1, 2], [2, 1], [1, -2], [-2, -1]]).build()],
			[TileColor.BLUE, new MovesetBuilder(this).addAll([[2, 2], [-2, 2], [-2, -2], [2, -2]]).build()],
		]);
	}

	isValid(): boolean {
		return true;
	}
}