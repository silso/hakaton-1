export interface Validatable {
	isValid: () => boolean;
}

export class Validator {
	private doCallbacks: Array<() => void>;
	private validCallbacks: Array<() => void>;
	private invalidCallbacks: Array<() => void>;
	protected constructor(private toValidate: Validatable) {}

	do(callback: () => void): Validator {
		this.doCallbacks.push(callback);
		return this;
	}

	ifValid(callback: () => void): Validator {
		this.validCallbacks.push(callback);
		return this;
	}

	ifInvalid(callback: () => void): Validator {
		this.invalidCallbacks.push(callback);
		return this;
	}

	validate(): boolean {
		this.doCallbacks.forEach(callback => callback());
		const valid = this.toValidate.isValid();
		if (valid) {
			this.validCallbacks.forEach(callback => callback());
		} else {
			this.invalidCallbacks.forEach(callback => callback());
		}
		return valid;
	}

	static for(toValidate: Validatable): Validator {
		return new Validator(toValidate);
	}
}