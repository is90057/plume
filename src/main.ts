// 組裝：editor docChanged → debounce 50ms → render → preview（SPEC「渲染管線規格」，
// 同步呼叫鏈、無 async）。快捷鍵與關閉攔截於 Task 4 加入。
import { getContent, initEditor, onChange } from "./editor";
import { initPreview, showError, update } from "./preview";
import { render } from "./renderer";

const editorEl = document.querySelector<HTMLElement>("#editor")!;
const previewEl = document.querySelector<HTMLElement>("#preview")!;

initEditor(editorEl);
initPreview(previewEl);

let debounceTimer: number | undefined;
onChange(() => {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    try {
      update(render(getContent()));
    } catch (e) {
      // SPEC 錯誤處理標準：編輯區不受影響；debounce 每次輸入重跑 render，天然自動重試
      showError(`渲染發生錯誤（下次輸入會自動重試）：${String(e)}`);
    }
  }, 50);
});
