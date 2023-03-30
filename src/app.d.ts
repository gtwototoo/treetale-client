// See https://kit.svelte.dev/docs/types#app

import type { IUser, RGB } from './lib/types';

// for information about these interfaces
declare global {
	interface Window {
		turnstile: any;
	}
	namespace App {
		interface Error {
			img: string;
			color?: RGB;
			message: string;
		}
		interface Locals {
			session: IUser | null;
		}
		interface Window {
			turnstile: any;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
