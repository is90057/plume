// 最近檔案清單（SPEC「模組職責」「資料模型」）：plugin-store 持久化 recent.json，
// 最多 10 筆、新→舊、path 去重。失效項由 file.ts 開啟失敗時呼叫 removeRecent 移除。
import { load, type Store } from "@tauri-apps/plugin-store";

export interface RecentFile {
  path: string; // 絕對路徑
  lastOpened: string; // ISO 8601
}

const STORE_FILE = "recent.json";
const KEY = "files";
const MAX_RECENT = 10;

let storePromise: Promise<Store> | null = null;

function getStore(): Promise<Store> {
  storePromise ??= load(STORE_FILE, { defaults: { [KEY]: [] }, autoSave: false });
  return storePromise;
}

export async function getRecent(): Promise<RecentFile[]> {
  try {
    const files = await (await getStore()).get<RecentFile[]>(KEY);
    return Array.isArray(files) ? files : [];
  } catch {
    return []; // SPEC 錯誤處理：store 損毀重建空清單，靜默
  }
}

export async function addRecent(path: string): Promise<void> {
  const current = await getRecent();
  const next = [
    { path, lastOpened: new Date().toISOString() },
    ...current.filter((f) => f.path !== path),
  ].slice(0, MAX_RECENT);
  const store = await getStore();
  await store.set(KEY, next);
  await store.save();
}

export async function removeRecent(path: string): Promise<void> {
  const current = await getRecent();
  const store = await getStore();
  await store.set(
    KEY,
    current.filter((f) => f.path !== path),
  );
  await store.save();
}
