// 預覽 DOM 更新（SPEC「模組職責」）。同步捲動與外部連結攔截屬 Task 5，在此擴充。
let container: HTMLElement | null = null;

export function initPreview(el: HTMLElement): void {
  container = el;
}

export function update(html: string): void {
  container!.innerHTML = html;
}

// SPEC 錯誤處理標準：渲染例外時預覽顯示錯誤帶。textContent 寫入，錯誤訊息不走 HTML。
export function showError(text: string): void {
  container!.textContent = text;
}
