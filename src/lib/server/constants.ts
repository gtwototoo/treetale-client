import type { CookieSerializeOptions } from 'cookie';

import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import ms from 'ms';

const [, domain] = PUBLIC_TREETALE_CLIENT_URL.split('//');

export const COOKIE_OPTIONS: { path: string } & CookieSerializeOptions = {
	domain,
	httpOnly: true,
	maxAge: ms('365d'),
	path: '/',
	sameSite: 'lax'
};
