# OMEN

OMEN is an institutional career intelligence platform built around one connected loop: **Discover → Measure → Explain → Improve → Verify → Match → Apply → Learn from outcomes**. It connects student profile evidence, market demand, readiness scoring, role matching, learning, projects, placement opportunities, applications, TPO review, notifications, and institutional intervention signals.

## What is implemented

The public landing page communicates the OMEN promise and routes into a responsive student workspace or TPO command center. The student workspace includes dashboard, Career DNA/profile, Market Employability Score, Career Explorer, Skill Gaps, Learning, Projects, Opportunities, Applications, Notifications, and a private profile/resume upload state. The TPO workspace includes command-center analytics, opportunity creation, outcome CSV validation/preview state, inferred skill gap intelligence, bootcamp creation, and demand-driven intervention states.

The backend exposes typed tRPC procedures under `omen.*`. The development service has deterministic score calculation, separate role matching and eligibility, explainable positive/improvement/market factors, a SQL what-if simulator, application recording, course enrollment, project submission, notifications, opportunity creation, and application status mutation. The development repository is intentionally labeled demo data and is not presented as historical institutional data.

## Supabase and Prisma

`prisma/schema.prisma` contains the portable Postgres contract for identity and roles, student evidence, skills, market snapshots, occupations, learning, assessments, projects, companies, jobs, eligibility, applications, status history, placement results, matches, skill gaps, bootcamps, polls, notifications, metrics, snapshots, and audit events.

`supabase/migrations/202609110001_omen_init.sql` contains the Supabase baseline for the core identity, skills, roles, jobs, applications, notifications, indexes, private Storage buckets, and Row Level Security policies. The migration scopes student data to the authenticated user and grants institution-wide reads only to authorized TPOs. `prisma/seed.ts` is safe for a development Supabase project and labels its catalog as development data.

The current preview runs on the managed full-stack runtime's built-in session and database boundary so it works without a Supabase key. The repository boundary is ready to be switched to Prisma/Supabase by implementing queries in `server/services/omen-data.ts` against the schema rather than changing UI procedure contracts.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` for the landing page. The main routes are `/app` for the student workspace, `/app/score` for the score and what-if simulator, `/app/opportunities` for matching and applications, `/app/learning` for the learning loop, `/app/projects` for evidence submission, `/tpo` for institutional intelligence, `/tpo/opportunities` for opportunity creation, `/tpo/outcomes` for CSV validation/preview, and `/tpo/bootcamps` for interventions.

For a Supabase deployment, keep `DATABASE_URL`, `DIRECT_URL`, and service-role credentials server-side. Expose only the public Supabase URL and anon key to the browser. Configure Google Auth through Supabase Auth rather than implementing a custom OAuth flow. Apply the migration with the Supabase CLI, run Prisma generation against a development project, and configure the private Storage buckets from the migration.

## Verification

```bash
pnpm check
pnpm test
pnpm build
```

The current test suite covers the scaffold auth logout contract plus OMEN score bounds, role matching/skill gaps, what-if projected impact, deterministic eligibility reasons, and application recording. The build produces the Vite client bundle and the Express server bundle. The preview has been manually inspected at the public landing page, `/app`, and `/tpo`.

## Security and data assumptions

Secrets are not committed. The browser must not receive a database password, Supabase service-role key, OAuth client secret, SMTP password, or private storage URL. Resume and project files are private by default. Resume extraction is modeled as a proposal workflow so parsed skills cannot overwrite manually entered information without confirmation. OMEN does not claim hiring probability or fabricate company rejection reasons. When reasons are unavailable, the product uses “Inferred Skill Gap” language based on requirements, profile coverage, matching analysis, and approved outcome data.
