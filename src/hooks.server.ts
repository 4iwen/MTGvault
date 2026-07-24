import type { Handle } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE, getUserBySessionToken } from '$lib/server/auth';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.user = null;

	if (token) {
		const user = await getUserBySessionToken(token);
		if (user) {
			event.locals.user = user;
		} else {
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	}

	if (WRITE_METHODS.has(event.request.method)) {
		const path = event.url.pathname;
		if (path.startsWith('/api/') && path !== '/api/login') {
			if (!event.locals.user) throw error(401, 'Session required');
		}
		if (
			event.request.method === 'POST' &&
			!event.locals.user &&
			(path.startsWith('/collection') || path.startsWith('/decks') || path.startsWith('/settings'))
		) {
			throw redirect(303, '/');
		}
	}

	return resolve(event);
};
