export function getRandomIntegerInRangeInclusively(min: number, max: number) {
	if (min > max) throw Error(`${min} is not smaller than ${max}`);

	const delta = Math.random() * max - min;

	return Math.round(min + delta);
}
