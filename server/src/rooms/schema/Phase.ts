import { ActionId } from './actions/AbstractAction';
import { Schema, type } from '@colyseus/schema';
import { Player } from './Player';

export enum PhaseType {
	GateStart,
	GameOver,
}

export class Phase extends Schema {
	@type('string') type: ActionId | PhaseType;
}

export class PlayerPhase extends Phase {
	type: ActionId;
	@type(Player) player: Player;

	constructor(player: Player, actionId: ActionId) {
		super();
		console.log('i have player and action: ', player.toJSON(), actionId);
		this.type = actionId;
		this.player = player;
	}
}

export class GameStartPhase extends Phase {
	type = PhaseType.GateStart;
}

export class GameOverPhase extends Phase {
	type = PhaseType.GameOver;
	@type(Player) player: Player;

	constructor(player: Player) {
		super();
		this.player = player;
	}
}