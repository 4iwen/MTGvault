import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { SESSION_COOKIE, createSession, verifyPin } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = (await request.json().catch(() => null)) as { pin?: string } | null;
	const pin = body?.pin;
	if (!pin || !/^\d{4}$/.test(pin)) throw error(400, 'PIN must be 4 digits');

	const rows = await db.select().from(user).limit(1);
	const admin = rows[0];
	if (!admin) throw error(404, 'No user configured');

	const ok = await verifyPin(pin, admin.pinHash);
	if (!ok) throw error(401, 'Invalid PIN');

	const { token, expiresAt } = await createSession(admin.id);
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		expires: expiresAt
	});

	return json({ ok: true, name: admin.name });
};
