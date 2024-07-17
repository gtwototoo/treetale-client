type QuasiBaseType = Date | RegExp | boolean | number | string | unknown;

export interface Elem {
	[index: number | string]: Elem | object | unknown;
}

export interface Diff {
	[index: string]: Diff | undefined | unknown;
}

const isQuasiBaseType = (value: unknown) => {
	return (
		value instanceof Function ||
		value instanceof Date ||
		value instanceof RegExp ||
		value instanceof String ||
		value instanceof Number ||
		value instanceof Boolean
	);
};

const isLikelyPlainObject = (value: Elem | QuasiBaseType) => {
	return typeof value === 'object' && value !== null && !isQuasiBaseType(value);
};

const applyDiff = <T extends Elem | Elem[]>(lhs: T, diff: Diff) => {
	if (!isLikelyPlainObject(diff) || !isLikelyPlainObject(lhs)) {
		lhs = diff as Diff & T;

		return lhs;
	}

	const keys = Object.keys(diff);

	if (keys.length === 0) {
		return lhs;
	}

	for (const key of keys) {
		if (isLikelyPlainObject(diff[key])) {
			if (Object.keys(diff[key] as Diff).length === 0) {
				lhs[key as unknown as number] = Array.isArray(diff[key]) ? [] : {};
			} else {
				lhs[key as unknown as number] = applyDiff(
					(lhs[key as unknown as number] as Elem) ?? {},
					diff[key] as Diff
				);
			}
		} else if (diff[key] === undefined) {
			if (lhs instanceof Array) {
				lhs.splice(+key, 1);
			} else {
				delete lhs[key];
			}
		} else {
			lhs[key as unknown as number] = diff[key];
		}
	}

	return lhs;
};

export { applyDiff };
