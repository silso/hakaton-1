import { Schema, MapSchema, type } from '@colyseus/schema';
import { iIAll } from '../../utilities/IterableIteratorUtils';
import { Validatable } from '../core/Validatable';
import { Board } from './Board';
import { Player } from './Player';

export class GameRoomState extends Schema implements Validatable {
	@type(Board) board = new Board(6, 6);
	@type({map: Player}) players = new MapSchema<Player>();

	isValid(): boolean {
		console.log('checking validity');
		return (
			this.board.isValid() &&
			iIAll(this.players.values(), ({position: {x, y}}) => 
				x >= 0 &&
				x < this.board.width &&
				y >= 0 &&
				y < this.board.height
			)
		);
	}
}
