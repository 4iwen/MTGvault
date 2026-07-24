import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { session, user } from './db/schema';
import { hashPin, verifyPin } from './crypto';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = 'mtgvault_session';

export { hashPin, verifyPin };

function newId(prefix: string): string {
	return `${prefix}_${randomBytes(16).toString('hex')}`;
}

function newToken(): string {
	return randomBytes(32).toString('hex');
}

export async function createSession(userId: string) {
	const id = newId('sess');
	const token = newToken();
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
	await db.insert(session).values({ id, token, userId, expiresAt });
	return { token, expiresAt };
}

export async function deleteSession(token: string) {
	await db.delete(session).where(eq(session.token, token));
}

export type SessionUser = {
	id: string;
	name: string;
};

export async function getUserBySessionToken(token: string): Promise<SessionUser | null> {
	const rows = await db
		.select({ id: user.id, name: user.name, expiresAt: session.expiresAt })
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.token, token))
		.limit(1);
	const row = rows[0];
	if (!row) return null;
	if (row.expiresAt.getTime() < Date.now()) {
		await deleteSession(token);
		return null;
	}
	return { id: row.id, name: row.name };
}

export async function getAdminUser() {
	const rows = await db.select().from(user).limit(1);
	return rows[0] ?? null;
}

export { newId };
