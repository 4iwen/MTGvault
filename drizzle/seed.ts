import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs') as {
	hash(data: string, saltOrRounds: number | string): Promise<string>;
};

const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	pinHash: text('pin_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL not set');
	process.exit(1);
}

const pin = process.env.DB_ADMIN_PIN;
if (!pin || !/^\d{4}$/.test(pin)) {
	console.error('DB_ADMIN_PIN must be set to a 4-digit PIN');
	process.exit(1);
}

async function main() {
	const client = postgres(url!);
	const db = drizzle(client, { schema: { user } });
	const existing = await db.select().from(user).limit(1);
	if (existing.length > 0) {
		console.log(`User already exists: ${existing[0].name} (${existing[0].id})`);
		await client.end();
		process.exit(0);
	}
	const id = `usr_${randomBytes(16).toString('hex')}`;
	const pinHash = await bcrypt.hash(pin!, 10);
	await db.insert(user).values({ id, name: 'admin', pinHash });
	console.log(`Seeded admin user (id=${id})`);
	await client.end();
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
