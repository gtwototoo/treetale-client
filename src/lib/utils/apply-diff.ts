type TQuasiBaseType = () => unknown | Date | RegExp | string | number | boolean;

function isQuasiBaseType(value: unknown) {
	return (
		value instanceof Function ||
		value instanceof Date ||
		value instanceof RegExp ||
		value instanceof String ||
		value instanceof Number ||
		value instanceof Boolean
	);
}

function isLikelyPlainObject<T>(value: TQuasiBaseType | IElem | T) {
	return typeof value === 'object' && value !== null && !isQuasiBaseType(value);
}

interface IElem {
	[index: string]: string | IElem;
}

function innerApplyDiff<T>(lhs: T, diff: object) {
	let keys: string[];
	if (isLikelyPlainObject(diff)) {
		keys = Object.keys(diff);
		if (keys.length === 0) {
			return lhs;
		} else if (isLikelyPlainObject<T>(lhs)) {
			for (const key of keys) {
				if (isLikelyPlainObject(diff[key])) {
					if (Object.keys(diff[key]).length === 0) {
						lhs[key] = {} as object;
					} else {
						lhs[key] = innerApplyDiff(lhs[key] ?? {}, diff[key]);
					}
				} else if (diff[key] === undefined) {
					if (lhs instanceof Array) {
						lhs.splice(+key, 1);
					} else {
						delete lhs[key];
					}
				} else {
					lhs[key] = diff[key];
				}
			}
		} else {
			lhs = diff;
		}
	} else {
		lhs = diff;
	}
	return lhs;
}

export function applyDiff<T extends object>(lns: T, diff: object) {
	if (lns instanceof Object && lns?.prototype != null) Object.freeze(lns.prototype);
	return innerApplyDiff(lns, diff);
}
