# OMEN architecture

## Connected product loop

Student profile → normalized skill graph → stored market snapshot → Market Employability Score and Career Readiness Score → explainable role match → skill gaps → learning path → assessment and project submission → TPO verification → updated skills → opportunity eligibility → resume/JD match → application → human TPO review → outcome → institutional gap intelligence → targeted bootcamp.

## Provider boundaries

`MarketDataProvider` consumes normalized snapshots rather than scraping on every request. `SkillExtractionProvider` parses resume text into proposed entities and never overwrites manual data. `MatchingService` uses deterministic skill overlap and leaves an embedding adapter slot for cosine similarity. `EligibilityService` is intentionally separate from semantic matching. `ScoringService` exposes versioned weights and returns positive factors, improvement areas, market factors, and data freshness. `OutcomePredictionProvider` is an interface only; OMEN does not make hiring-probability claims without labeled outcomes.

## Security posture

Supabase Auth is the target authentication system. The browser receives only the public URL and anon key; service-role keys and database credentials remain server-side. RLS policies scope student rows to `auth.uid()` and grant TPO access through `is_tpo()`. Storage buckets are private by default. The preview uses the scaffold's secure session boundary and demo data; production Supabase wiring is isolated behind environment variables and repositories.

## UI route map

Public: `/`.

Student workspace: `/app`, `/app/profile`, `/app/score`, `/app/careers`, `/app/gaps`, `/app/learning`, `/app/projects`, `/app/opportunities`, `/app/applications`, `/app/notifications`.

TPO workspace: `/tpo`, `/tpo/opportunities`, `/tpo/outcomes`, `/tpo/bootcamps`.

## Demo data policy

Seeded roles, jobs, courses, skill observations, and the sample student are development data. Labels in the UI and docs make that distinction explicit. Placement outcome summaries are framed as institutional signals or inferred skill gaps, never as claims about why a company rejected an individual.
