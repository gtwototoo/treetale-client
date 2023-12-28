import objectPath from 'object-path';

export const serialize = <T>(object?: T): T => {
	if (!object) {
		return object;
	}

	return JSON.parse(JSON.stringify(object)) as T;
};

export const exclude = <T extends object>(object: T, keys: Array<string> | string) => {
	const serialized = serialize(object);

	if (keys instanceof String) {
		objectPath.del(serialized, keys);
	} else {
		for (const key of keys) {
			objectPath.del(serialized, key);
		}
	}

	return serialized;
};

export const last = <T>(array: Array<T>) => {
	return array?.[array.length - 1];
};
