import { ActionId } from './actions/AbstractAction';
import { Schema, type } from '@colyseus/schema';
import { Player } from './Player';

// set enum PhaseType equal to ActionId
export type PhaseType = ActionId;
export const PhaseType = {...ActionId};

export class PlayerPhase extends Schema {
	@type(Player) player: Player;
	@type('string') type: PhaseType;

	constructor(player: Player, phaseType: PhaseType) {
		super();
		this.player = player;
		this.type = phaseType;
	}
}