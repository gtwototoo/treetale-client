type TQuasiBaseType = unknown | Date | RegExp | string | number | boolean;

interface IElem {
	[index: string | number]: IElem | unknown | object;
}

export interface IDiff {
	[index: string]: IDiff | undefined | unknown;
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

const isLikelyPlainObject = (value: TQuasiBaseType | IElem) => {
	return typeof value === 'object' && value !== null && !isQuasiBaseType(value);
};

const applyDiff = <T extends IElem | Array<IElem>>(lhs: T, diff: IDiff) => {
	if (!isLikelyPlainObject(diff) || !isLikelyPlainObject(lhs)) {
		lhs = diff as T & IDiff;

		return lhs;
	}

	const keys = Object.keys(diff);

	if (keys.length === 0) {
		return lhs;
	}

	for (const key of keys) {
		if (isLikelyPlainObject(diff[key])) {
			if (Object.keys(diff[key]).length === 0) {
				lhs[key as unknown as number] = Array.isArray(diff[key]) ? [] : {};
			} else {
				lhs[key as unknown as number] = applyDiff(
					(lhs[key as unknown as number] as IElem) ?? {},
					diff[key] as IDiff
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
