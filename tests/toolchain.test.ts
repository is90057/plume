// Task 0 完成信號:驗證 Vitest + jsdom 測試鏈路可運作。
// Task 2 放入第一個真測試（tests/renderer.test.ts）後移除本檔。
import { describe, expect, it } from "vitest";

describe("test toolchain", () => {
  it("vitest 與 jsdom 環境就緒", () => {
    expect(document.createElement("div").tagName).toBe("DIV");
  });
});
