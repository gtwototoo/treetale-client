import objectPath from 'object-path';

export const serialize = (object: Record<string, unknown> | unknown[]) => {
	return JSON.parse(JSON.stringify(object));
};

export const exclude = (object: Record<string, unknown>, keys: string[] | string) => {
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
