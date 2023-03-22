// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			img?: string;
			color?: import('./lib/types').RGB;
		}
		interface Locals {
			session: import('./lib/types').IUser | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
