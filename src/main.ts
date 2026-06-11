// Task 0 IPC spike — 驗證「dialog 授權路徑會被動態加入 fs scope」承重牆假設
// （docs/PLAN.md Task 0 / docs/SPEC.md ⚠️ 標記）。驗證通過後此檔由正式版面取代。
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

const btn = document.querySelector<HTMLButtonElement>("#spike-open")!;
const out = document.querySelector<HTMLPreElement>("#spike-output")!;

btn.addEventListener("click", async () => {
  try {
    const path = await open({
      multiple: false,
      filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
    });
    if (path === null) {
      out.textContent = "（已取消選擇）";
      return;
    }
    const content = await readTextFile(path);
    out.textContent = [
      "✅ IPC spike 成功：dialog 授權路徑 → readTextFile 讀取通過",
      `path: ${path}`,
      "--- 內容前 500 字 ---",
      content.slice(0, 500),
    ].join("\n");
  } catch (e) {
    out.textContent = `❌ IPC spike 失敗：${e}`;
  }
});
