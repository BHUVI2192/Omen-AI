import { describe, expect, it } from "vitest";
import { applyToJob, getDashboard, getGaps, getJobs, getRoles, simulateWhatIf } from "./services/omen-data";

describe("OMEN deterministic intelligence", () => {
  it("returns an explainable readiness score with factor breakdown", () => {
    const dashboard = getDashboard();
    expect(dashboard.score.total).toBeGreaterThanOrEqual(0);
    expect(dashboard.score.total).toBeLessThanOrEqual(100);
    expect(dashboard.score.skillCoverage).toBeGreaterThan(0);
    expect(dashboard.dataFreshness).toContain("Development dataset");
  });

  it("separates role matching from skill gaps", () => {
    const roles = getRoles();
    expect(roles.length).toBeGreaterThan(0);
    expect(roles[0]?.score).toBeGreaterThan(0);
    expect(Array.isArray(roles[0]?.missingSkills)).toBe(true);
    expect(getGaps().some((gap) => gap.name === "SQL")).toBe(true);
  });

  it("labels what-if outputs as projected impact", () => {
    const result = simulateWhatIf("SQL", 43, 75);
    expect(result.after).toBeGreaterThan(result.before);
    expect(result.roleMatchAfter).toBeGreaterThanOrEqual(result.roleMatchBefore);
    expect(result.label).toContain("Projected impact");
  });

  it("returns deterministic eligibility reasons independently from match score", () => {
    const northstar = getJobs().find((job) => job.id === "job-northstar");
    expect(northstar).toBeDefined();
    expect(typeof northstar?.eligible).toBe("boolean");
    expect(Array.isArray(northstar?.reasons)).toBe(true);
  });

  it("records a student application without pretending to submit to an external portal", () => {
    const result = applyToJob("job-arc");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.application.status).toBe("APPLIED");
  });
});
