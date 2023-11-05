import mongoose from 'mongoose';

import { dev } from '$app/environment';
import { MONGODB_URI } from '$env/static/private';
import { randomError } from '$lib/utils';

if (!MONGODB_URI) {
	console.error('Please define the MONGODB_URI environment variable');
	throw randomError(500);
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = {
		connection: null,
		promise: null
	};
}

export const mongooseConnect = async () => {
	if (cached.connection) {
		return cached.connection;
	}

	if (!cached.promise) {
		mongoose.set('strictQuery', false);
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				autoIndex: dev
			})
			.then((mongoose) => {
				console.info('mongoose started.');

				return mongoose;
			});
	}

	cached.connection = await cached.promise;

	return cached.connection;
};
