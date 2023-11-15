import '@total-typescript/ts-reset';
import type { IUser, TRGB } from './lib/types';

declare global {
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
