import { describe, expect, it } from "vite-plus/test";

import { reorderModelsForDrag } from "./ProviderModelsSection";

describe("reorderModelsForDrag", () => {
  const groupOf = (slug: string) =>
    slug === "h1" || slug === "h2" ? "hidden" : slug === "f1" ? "favorite" : "visible";

  it("moves a bottom slug to the top within the same group", () => {
    expect(reorderModelsForDrag(["a", "b", "c", "d"], "d", "a", groupOf, [])).toEqual({
      order: ["d", "a", "b", "c"],
      hiddenModels: null,
    });
  });

  it("moves a slug down to an arbitrary position", () => {
    expect(reorderModelsForDrag(["a", "b", "c", "d"], "a", "c", groupOf, [])).toEqual({
      order: ["b", "c", "a", "d"],
      hiddenModels: null,
    });
  });

  it("returns null for no-op drops", () => {
    expect(reorderModelsForDrag(["a", "b"], "a", "a", groupOf, [])).toBeNull();
    expect(reorderModelsForDrag(["a", "b"], "a", null, groupOf, [])).toBeNull();
  });

  it("reorders within the hidden group", () => {
    expect(reorderModelsForDrag(["a", "h1", "h2"], "h2", "h1", groupOf, ["h1", "h2"])).toEqual({
      order: ["a", "h2", "h1"],
      hiddenModels: null,
    });
  });

  it("shows a hidden model in the picker when dragged into the visible list", () => {
    expect(reorderModelsForDrag(["a", "b", "h1", "h2"], "h1", "a", groupOf, ["h1", "h2"])).toEqual({
      order: ["h1", "a", "b", "h2"],
      hiddenModels: ["h2"],
    });
  });

  it("hides a visible model when dragged into the hidden section", () => {
    expect(reorderModelsForDrag(["a", "b", "h1", "h2"], "b", "h1", groupOf, ["h1", "h2"])).toEqual({
      order: ["a", "h1", "b", "h2"],
      hiddenModels: ["h1", "h2", "b"],
    });
  });

  it("preserves unrelated hidden entries when crossing the boundary", () => {
    expect(reorderModelsForDrag(["a", "h1"], "a", "h1", groupOf, ["h1", "legacy"])).toEqual({
      order: ["h1", "a"],
      hiddenModels: ["h1", "legacy", "a"],
    });
  });

  it("keeps favorites out of the hidden boundary", () => {
    expect(reorderModelsForDrag(["f1", "a", "h1"], "f1", "h1", groupOf, ["h1"])).toBeNull();
    expect(reorderModelsForDrag(["f1", "a", "h1"], "h1", "f1", groupOf, ["h1"])).toBeNull();
  });

  it("returns null for unknown slugs", () => {
    expect(reorderModelsForDrag(["a", "b"], "zzz", "a", groupOf, [])).toBeNull();
    expect(reorderModelsForDrag(["a", "b"], "a", "zzz", groupOf, [])).toBeNull();
  });
});
