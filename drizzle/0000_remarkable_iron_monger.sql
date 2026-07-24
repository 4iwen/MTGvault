CREATE TABLE "card" (
	"scryfall_id" text PRIMARY KEY NOT NULL,
	"oracle_id" text,
	"name" text NOT NULL,
	"lang" text DEFAULT 'en' NOT NULL,
	"released_at" text,
	"uri" text,
	"scryfall_uri" text,
	"layout" text,
	"highres_image" boolean DEFAULT false,
	"image_status" text,
	"mana_cost" text,
	"cmc" numeric,
	"type_line" text,
	"oracle_text" text,
	"power" text,
	"toughness" text,
	"colors" jsonb,
	"color_identity" jsonb,
	"keywords" jsonb,
	"legalities" jsonb,
	"games" jsonb,
	"reserved" boolean DEFAULT false,
	"foil" boolean DEFAULT false,
	"nonfoil" boolean DEFAULT true,
	"oversized" boolean DEFAULT false,
	"promo" boolean DEFAULT false,
	"reprint" boolean DEFAULT false,
	"variation" boolean DEFAULT false,
	"set_code" text NOT NULL,
	"set_name" text,
	"set_type" text,
	"set_uri" text,
	"scryfall_set_uri" text,
	"collector_number" text NOT NULL,
	"digital" boolean DEFAULT false,
	"rarity" text,
	"artist" text,
	"illustration_id" text,
	"border_color" text,
	"frame" text,
	"frame_effects" jsonb,
	"security_stamp" text,
	"full_art" boolean DEFAULT false,
	"textless" boolean DEFAULT false,
	"booster" boolean DEFAULT false,
	"story_spotlight" boolean DEFAULT false,
	"edhrec_rank" integer,
	"penny_rank" integer,
	"prices" jsonb,
	"image_uris" jsonb,
	"related_uris" jsonb,
	"purchase_uris" jsonb,
	"card_faces" jsonb,
	"all_parts" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"format" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_card" (
	"deck_id" text NOT NULL,
	"card_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"category" text DEFAULT 'mainboard' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deck_card_deck_id_card_id_category_pk" PRIMARY KEY("deck_id","card_id","category")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pin_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deck" ADD CONSTRAINT "deck_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_card" ADD CONSTRAINT "deck_card_deck_id_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."deck"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_card" ADD CONSTRAINT "deck_card_card_id_card_scryfall_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("scryfall_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "card_set_collector_idx" ON "card" USING btree ("set_code","collector_number","lang");--> statement-breakpoint
CREATE INDEX "card_name_idx" ON "card" USING btree ("name");--> statement-breakpoint
CREATE INDEX "card_oracle_idx" ON "card" USING btree ("oracle_id");--> statement-breakpoint
CREATE INDEX "card_rarity_idx" ON "card" USING btree ("rarity");--> statement-breakpoint
CREATE INDEX "deck_user_idx" ON "deck" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");