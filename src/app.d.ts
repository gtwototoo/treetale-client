import '@total-typescript/ts-reset';
import type { IUser, RGB } from './lib/types';

declare global {
	namespace App {
		interface Error {
			img?: string;
			color?: RGB;
			message: string;
			theme: 'light' | 'dark';
		}
		interface Locals {
			session: IUser | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
