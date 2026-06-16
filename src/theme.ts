import { load, type Store } from "@tauri-apps/plugin-store";

export type ThemeName = "vol-de-nuit" | "inkstone";
export type ThemeChoice = ThemeName | "auto";

const STORE_FILE = "settings.json";
const KEY = "theme";
const DEFAULT_CHOICE: ThemeChoice = "vol-de-nuit";

let storePromise: Promise<Store> | null = null;
let choice: ThemeChoice = DEFAULT_CHOICE;
let changeCallback: (() => void) | null = null;
let mq: MediaQueryList | null = null;

function getStore(): Promise<Store> {
  storePromise ??= load(STORE_FILE, { defaults: { [KEY]: DEFAULT_CHOICE }, autoSave: false });
  return storePromise;
}

function isChoice(v: unknown): v is ThemeChoice {
  return v === "vol-de-nuit" || v === "inkstone" || v === "auto";
}

function systemIsDark(): boolean {
  return mq?.matches ?? false;
}

function resolve(c: ThemeChoice): ThemeName {
  if (c === "auto") return systemIsDark() ? "vol-de-nuit" : "inkstone";
  return c;
}

function applyToDOM(): void {
  document.documentElement.dataset.themeChoice = choice;
  document.documentElement.dataset.theme = resolve(choice);
}

export function currentTheme(): ThemeName {
  const v = document.documentElement.dataset.theme;
  return v === "vol-de-nuit" || v === "inkstone" ? v : "vol-de-nuit";
}

export function currentChoice(): ThemeChoice {
  return choice;
}

export function onThemeChange(cb: () => void): void {
  changeCallback = cb;
}

export async function initTheme(): Promise<void> {
  if (typeof window.matchMedia === "function") {
    mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      if (choice === "auto") {
        applyToDOM();
        changeCallback?.();
      }
    });
  }
  try {
    const saved = await (await getStore()).get(KEY);
    if (isChoice(saved)) choice = saved;
  } catch {}
  applyToDOM();
}

export async function setTheme(next: ThemeChoice): Promise<void> {
  choice = next;
  applyToDOM();
  try {
    const store = await getStore();
    await store.set(KEY, next);
    await store.save();
  } catch {}
}

export async function toggleTheme(): Promise<ThemeChoice> {
  const order: ThemeChoice[] = ["vol-de-nuit", "inkstone", "auto"];
  const idx = order.indexOf(choice);
  const next = order[(idx + 1) % order.length];
  await setTheme(next);
  return next;
}
