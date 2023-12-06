/// <reference types="@sveltejs/kit" />
/// <reference types="svelte-gestures" />

import '@total-typescript/ts-reset';
import type { Mongoose } from 'mongoose';
import type { IUser, TRGB } from './lib/types';

/* eslint-disable no-var */

declare global {
	var mongoose: {
		connection: Mongoose;
		promise: Promise<Mongoose>;
	};

	namespace App {
		interface Error {
			color?: TRGB;
			img?: string;
			message: string;
		}
		interface Locals {
			session: IUser | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
