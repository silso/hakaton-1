import { Schema, MapSchema, type } from '@colyseus/schema';
import { Player } from './Player';

export class GameRoomState extends Schema {
	@type('number') width = 8;
	@type('number') height = 8;
	@type({map: Player}) players = new MapSchema<Player>();
}
