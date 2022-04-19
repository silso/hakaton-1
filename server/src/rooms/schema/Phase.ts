import { ActionId } from './actions/AbstractAction';
import { Schema, type } from '@colyseus/schema';
import { Player } from './Player';

export class PlayerPhase extends Schema {
	@type(Player) player: Player;
	@type('string') type: ActionId;

	constructor(player: Player, actionId: ActionId) {
		super();
		console.log('i have player and action: ', player.toJSON(), actionId);
		this.player = player;
		this.type = actionId;
	}
}