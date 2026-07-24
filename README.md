# MTGvault

Local-only Magic: The Gathering collection + deck tracker.

## Setup

```sh
npm install
docker compose up -d
npm run db:migrate
DB_ADMIN_PIN=1234 npm run db:seed
npm run dev
```

## Scripts

```
dev
build
preview
check
lint
format
db:start | db:generate | db:push | db:migrate | db:seed | db:studio
```

Stack: SvelteKit 2, Svelte 5, Tailwind 4, shadcn-svelte, Drizzle, Postgres.
