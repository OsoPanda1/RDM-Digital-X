import { describe, expect, it } from "vitest";
import { fusionPillars, fusionRepositories, getFusionReadiness } from "@/data/fusion-repos";

describe("fusionRepositories", () => {
  it("unifies the four requested repositories", () => {
    expect(fusionRepositories.map((repo) => repo.id)).toEqual([
      "rdm-digital-nodo-cero",
      "rdm-turismodigital",
      "real-del-monte-twin",
      "citemesh-roots",
    ]);
  });

  it("exposes navigable capabilities and useful contracts", () => {
    for (const repo of fusionRepositories) {
      expect(repo.capabilities.length).toBeGreaterThanOrEqual(2);
      expect(repo.contracts.length).toBeGreaterThan(0);
      expect(repo.url).toContain(`OsoPanda1/${repo.id}`);
    }
  });

  it("keeps readiness high enough for an operational fusion", () => {
    expect(getFusionReadiness()).toBeGreaterThanOrEqual(90);
    expect(fusionPillars).toHaveLength(3);
  });
});
