import { load, type Store } from "@tauri-apps/plugin-store";

export type FontFamily = "serif" | "sans" | "mono";

const STORE_FILE = "settings.json";
const FONT_KEY = "readingFont";
const SIZE_KEY = "readingSize";

const FONT_STACKS: Record<FontFamily, string> = {
  serif: '"Literata", "Noto Serif TC", serif',
  sans: '"Noto Sans TC", "PingFang TC", sans-serif',
  mono: '"JetBrains Mono", "Noto Sans TC", monospace',
};

const DEFAULT_SIZE = 15.5;
const MIN_SIZE = 12;
const MAX_SIZE = 24;
const SIZE_STEP = 1.5;

let fontFamily: FontFamily | null = null;
let fontSize: number = DEFAULT_SIZE;
let storePromise: Promise<Store> | null = null;

function getStore(): Promise<Store> {
  storePromise ??= load(STORE_FILE, { defaults: {}, autoSave: false });
  return storePromise;
}

function isFont(v: unknown): v is FontFamily {
  return v === "serif" || v === "sans" || v === "mono";
}

function applyToDOM(): void {
  const el = document.documentElement;
  if (fontFamily) {
    el.style.setProperty("--reading-font", FONT_STACKS[fontFamily]);
  } else {
    el.style.removeProperty("--reading-font");
  }
  el.style.setProperty("--reading-size", `${fontSize}px`);
}

export function currentFont(): FontFamily | null {
  return fontFamily;
}

export function currentSize(): number {
  return fontSize;
}

export async function setFont(family: FontFamily | null): Promise<void> {
  fontFamily = family;
  applyToDOM();
  try {
    const store = await getStore();
    await store.set(FONT_KEY, family);
    await store.save();
  } catch {}
}

export async function setSize(size: number): Promise<void> {
  fontSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));
  applyToDOM();
  try {
    const store = await getStore();
    await store.set(SIZE_KEY, fontSize);
    await store.save();
  } catch {}
}

export async function increaseSize(): Promise<void> {
  await setSize(fontSize + SIZE_STEP);
}

export async function decreaseSize(): Promise<void> {
  await setSize(fontSize - SIZE_STEP);
}

export async function resetSize(): Promise<void> {
  await setSize(DEFAULT_SIZE);
}

export async function initReadingPrefs(): Promise<void> {
  try {
    const store = await getStore();
    const savedFont = await store.get(FONT_KEY);
    const savedSize = await store.get(SIZE_KEY);
    if (isFont(savedFont)) fontFamily = savedFont;
    if (typeof savedSize === "number") fontSize = savedSize;
  } catch {}
  applyToDOM();
}
