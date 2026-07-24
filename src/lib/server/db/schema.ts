import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	numeric,
	jsonb,
	primaryKey,
	uniqueIndex,
	index
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	pinHash: text('pin_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		token: text('token').notNull().unique(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(t) => [index('session_user_idx').on(t.userId)]
);

export const card = pgTable(
	'card',
	{
		scryfallId: text('scryfall_id').primaryKey(),
		oracleId: text('oracle_id'),
		name: text('name').notNull(),
		lang: text('lang').notNull().default('en'),
		releasedAt: text('released_at'),
		uri: text('uri'),
		scryfallUri: text('scryfall_uri'),
		layout: text('layout'),
		highresImage: boolean('highres_image').default(false),
		imageStatus: text('image_status'),
		manaCost: text('mana_cost'),
		cmc: numeric('cmc'),
		typeLine: text('type_line'),
		oracleText: text('oracle_text'),
		power: text('power'),
		toughness: text('toughness'),
		colors: jsonb('colors').$type<string[]>(),
		colorIdentity: jsonb('color_identity').$type<string[]>(),
		keywords: jsonb('keywords').$type<string[]>(),
		legalities: jsonb('legalities').$type<Record<string, string>>(),
		games: jsonb('games').$type<string[]>(),
		reserved: boolean('reserved').default(false),
		foil: boolean('foil').default(false),
		nonfoil: boolean('nonfoil').default(true),
		oversized: boolean('oversized').default(false),
		promo: boolean('promo').default(false),
		reprint: boolean('reprint').default(false),
		variation: boolean('variation').default(false),
		setCode: text('set_code').notNull(),
		setName: text('set_name'),
		setType: text('set_type'),
		setUri: text('set_uri'),
		scryfallSetUri: text('scryfall_set_uri'),
		collectorNumber: text('collector_number').notNull(),
		digital: boolean('digital').default(false),
		rarity: text('rarity'),
		artist: text('artist'),
		illustrationId: text('illustration_id'),
		borderColor: text('border_color'),
		frame: text('frame'),
		frameEffects: jsonb('frame_effects').$type<string[]>(),
		securityStamp: text('security_stamp'),
		fullArt: boolean('full_art').default(false),
		textless: boolean('textless').default(false),
		booster: boolean('booster').default(false),
		storySpotlight: boolean('story_spotlight').default(false),
		edhrecRank: integer('edhrec_rank'),
		pennyRank: integer('penny_rank'),
		prices: jsonb('prices').$type<Record<string, string | null>>(),
		imageUris: jsonb('image_uris').$type<Record<string, string>>(),
		relatedUris: jsonb('related_uris').$type<Record<string, string>>(),
		purchaseUris: jsonb('purchase_uris').$type<Record<string, string>>(),
		cardFaces: jsonb('card_faces').$type<unknown[]>(),
		allParts: jsonb('all_parts').$type<unknown[]>(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(t) => [
		uniqueIndex('card_set_collector_idx').on(t.setCode, t.collectorNumber, t.lang),
		index('card_name_idx').on(t.name),
		index('card_oracle_idx').on(t.oracleId),
		index('card_rarity_idx').on(t.rarity)
	]
);

export const deck = pgTable(
	'deck',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		format: text('format'),
		description: text('description'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(t) => [index('deck_user_idx').on(t.userId)]
);

export const deckCard = pgTable(
	'deck_card',
	{
		deckId: text('deck_id')
			.notNull()
			.references(() => deck.id, { onDelete: 'cascade' }),
		cardId: text('card_id')
			.notNull()
			.references(() => card.scryfallId, { onDelete: 'cascade' }),
		quantity: integer('quantity').notNull().default(1),
		category: text('category').notNull().default('mainboard'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(t) => [primaryKey({ columns: [t.deckId, t.cardId, t.category] })]
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	decks: many(deck)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const deckRelations = relations(deck, ({ one, many }) => ({
	user: one(user, { fields: [deck.userId], references: [user.id] }),
	cards: many(deckCard)
}));

export const deckCardRelations = relations(deckCard, ({ one }) => ({
	deck: one(deck, { fields: [deckCard.deckId], references: [deck.id] }),
	card: one(card, { fields: [deckCard.cardId], references: [card.scryfallId] })
}));
