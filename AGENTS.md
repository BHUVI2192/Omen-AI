# OMEN repository rules

- Keep product code under `client/src`, `server`, `shared`, `prisma`, `supabase`, and `docs`.
- Never commit `.env`, Supabase service-role keys, database passwords, OAuth secrets, or private file URLs.
- Keep development seed data labeled and do not present it as institutional history.
- Add domain logic to `server/services` before wiring a tRPC procedure.
- Keep UI data access inside typed tRPC hooks or typed service modules; do not scatter raw fetch calls through components.
- Treat eligibility, matching, and score as separate concepts and show the distinction in product copy.
- Run `pnpm check`, `pnpm test`, and `pnpm build` before delivery.
