import type { CookieSerializeOptions } from 'cookie';

import { dev } from '$app/environment';
import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import ms from 'ms';

export const COOKIE_OPTIONS: { path: string } & CookieSerializeOptions = {
	httpOnly: true,
	maxAge: ms('365d'),
	path: '/',
	sameSite: 'lax',
	secure: !dev
};

if (!dev) {
	const [, domain] = PUBLIC_TREETALE_CLIENT_URL.split('//');

	COOKIE_OPTIONS.domain = `.${domain}`;
}
