import { BaseAction, ActionId } from './BaseAction';
import { Movement } from '../Movesets';

// actual actions
export class Action extends BaseAction<Movement> {
	id = ActionId.Movement;

	doExecute = () => {
		this.player.move(this.payload);
	};
}

export type Input = ConstructorParameters<typeof Movement>[0];

export function isInputValid(input: Record<string, unknown>): input is Input {
	if (input.hasOwnProperty('x') && input.hasOwnProperty('y')) {
		return true;
	}
	return false;
}

export function inputToPayload(input: Input): Movement {
	return new Movement(input);
}