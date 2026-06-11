// @types/markdown-it-task-lists 不存在於 npm registry（2026-06-11 驗證），自寫最小宣告。
// 只宣告本專案用到的形式：md.use(taskLists)，不帶 options（預設輸出 disabled checkbox）。
declare module "markdown-it-task-lists" {
  import type { PluginSimple } from "markdown-it";

  const taskLists: PluginSimple;
  export default taskLists;
}
