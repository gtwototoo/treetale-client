import '@total-typescript/ts-reset';
import type { IUser, TRGB } from './lib/types';

declare global {
	namespace App {
		interface Error {
			img?: string;
			color?: TRGB;
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
