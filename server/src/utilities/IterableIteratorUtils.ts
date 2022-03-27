export function iIAll<T>(iI: IterableIterator<T>, condition: (input: T) => boolean): boolean {
	let res = iI.next();
	while (!res.done) {
		if (!condition(res.value)) {
			return false;
		}
		res = iI.next();
	}
	return true;
}

export function iIMap<T, U>(iI: IterableIterator<T>, mapper: (input: T) => U): U[] {
	const results: U[] = [];

	let res = iI.next();
	while (!res.done) {
		results.push(mapper(res.value));
		res = iI.next();
	}
	return results;
}