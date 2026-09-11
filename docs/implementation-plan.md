# OMEN implementation plan

## Repository assessment

The repository was initialized as a Vite + React 19 + TypeScript + Tailwind + Express + tRPC application with Manus OAuth, Drizzle, file storage helpers, Vitest, and a managed development server. There was no existing product code, domain schema, migration history, or application-specific UI to preserve. The project is therefore being implemented as a vertical-slice product on the available runtime, with a portable Supabase/PostgreSQL contract checked into `prisma/` and `supabase/`.

## Architecture

The runtime application uses a typed tRPC boundary so the UI and backend share contracts without scattered fetch calls. `server/services/omen-data.ts` is the first repository-backed domain service: it holds clearly labeled development data and deterministic mutations for the demo flow. The same service boundary is intentionally shaped around the Supabase entities in `prisma/schema.prisma`, so replacing the development repository with Prisma/Supabase queries does not change the UI contracts.

The frontend is an information-dense but calm institutional workspace. A public landing page communicates the Discover → Measure → Improve → Match → Apply loop. Authenticated-looking demo views expose the student dashboard, career DNA, market score, role explorer, gaps, learning, projects, opportunities, applications, notifications, profile, and a TPO analytics workspace. Actions such as applying, saving roles, enrolling in a course, and submitting a project are wired to tRPC mutations and update the in-memory development repository with visible feedback.

## Dependency decisions

The existing project dependencies are sufficient: React, wouter, tRPC, Drizzle, lucide-react, recharts, zod, sonner, and the prebuilt UI primitives. No external LLM is required. The intelligence layer uses explainable weighted scoring, set-based skill coverage, role matching, and deterministic eligibility. Supabase is represented as the target Postgres/Auth/Storage platform in the Prisma schema, SQL migration, RLS policy set, and `.env.example`; the managed preview continues to use the scaffold's runtime database/auth services so it is runnable in this session.

## Domain entities and relationships

Identity includes profiles, roles, departments, cohorts, student profiles, and TPO profiles. Student evidence includes skills, student skills, certifications, projects, internships, hackathons, assessments, resumes, and extracted resume skills. Market intelligence includes sources, snapshots, occupations, roles, role skills, and demand observations. Learning includes courses, phases, resources, assessments, questions, practice tasks, progress, attempts, and project submissions. Placement includes companies, jobs, requirements, eligibility rules, applications, status history, and placement results. Intervention includes career-role matches, student-job matches, skill gaps, bootcamps, polls, responses, enrollments, notifications, preferences, metrics, and snapshots.

The schema uses Postgres UUID primary keys, explicit enums, timestamp columns, unique constraints, foreign keys, indexes for common filters, and `Json` payloads only where a flexible explanation or structured extraction is the right boundary. Private resumes and project submission files are represented as storage paths, never public URLs.

## Implementation phases

1. Establish the repository assessment, architecture, environment placeholders, Prisma contract, migration/RLS policy, and seed data.
2. Implement shared OMEN data services: score calculation, role matching, eligibility, what-if simulation, application mutation, learning progress, and notifications.
3. Build the public landing page and the responsive student workspace with shared navigation and reusable cards.
4. Build the TPO dashboard, opportunity creation surface, recommendations, CSV workflow preview, and institutional gap analytics.
5. Run type checks, tests, production build, preview checks, and fix any defects. Save one final checkpoint only after the website is coherent.

## Risks and assumptions

The attached brief requests FastAPI and Supabase, while the managed session provides a Node/Express/tRPC scaffold and its database is not Supabase. The lowest-risk implementation is to keep the preview fully runnable on the provided stack while shipping a complete Supabase/Postgres Prisma and SQL contract for deployment to Supabase. Development data is explicitly labeled and is not presented as historical institutional outcomes. A live resume parser, external market provider, Google OAuth, email provider, and real file upload require credentials and are represented by server-side provider boundaries and UI states rather than hard dependencies. The score is a market-readiness heuristic, not a hiring probability.
