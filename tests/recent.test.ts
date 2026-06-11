// Task 6 最近檔案測試（docs/PLAN.md 測試設計）。plugin-store mock 為 in-memory map，
// recent.ts 的 store 是模組級單例，每測試 resetModules + 動態 import 取得乾淨狀態。
import { beforeEach, describe, expect, it, vi } from "vitest";

const storeMocks = vi.hoisted(() => {
  const data = new Map<string, unknown>();
  return {
    data,
    fakeStore: {
      get: vi.fn((key: string) => Promise.resolve(data.get(key))),
      set: vi.fn((key: string, value: unknown) => {
        data.set(key, value);
        return Promise.resolve();
      }),
      save: vi.fn(() => Promise.resolve()),
    },
  };
});

vi.mock("@tauri-apps/plugin-store", () => ({
  load: vi.fn(() => Promise.resolve(storeMocks.fakeStore)),
}));

async function loadRecentModule() {
  vi.resetModules();
  return await import("../src/recent");
}

beforeEach(() => {
  vi.clearAllMocks();
  storeMocks.data.clear();
});

describe("recent", () => {
  it("test_recent_add_newPath_prependsAndDedupes", async () => {
    const recent = await loadRecentModule();
    await recent.addRecent("/docs/a.md");
    await recent.addRecent("/docs/b.md");
    await recent.addRecent("/docs/a.md"); // 重複開啟 a，應去重並移到最前

    const files = await recent.getRecent();
    expect(files.map((f) => f.path)).toEqual(["/docs/a.md", "/docs/b.md"]);
    expect(storeMocks.fakeStore.save).toHaveBeenCalled(); // 確實持久化
  });

  it("test_recent_add_eleventhItem_dropsOldest", async () => {
    const recent = await loadRecentModule();
    for (let i = 1; i <= 11; i++) {
      await recent.addRecent(`/docs/${i}.md`);
    }

    const files = await recent.getRecent();
    expect(files).toHaveLength(10);
    expect(files[0].path).toBe("/docs/11.md"); // 最新在前
    expect(files.map((f) => f.path)).not.toContain("/docs/1.md"); // 最舊被擠出
  });

  it("test_recent_corruptStore_rebuildsEmptyList", async () => {
    storeMocks.data.set("files", "不是陣列"); // SPEC 錯誤處理：store 損毀重建空清單，靜默
    const recent = await loadRecentModule();
    expect(await recent.getRecent()).toEqual([]);
  });
});
