import { browser } from "wxt/browser";

export const StorageKey = {
  LANGUAGE: "local:language",
  SCROLL_CLOSE: "local:scroll-close",
  EXPLANATION_STYLE: "local:explanation-style",
  THEME: "local:theme",
  TOKEN: "local:token",
  TRIGGER_POSITION: "local:trigger-position",
  PINNED_BTN_POSITION: "local:pinned-btn-position",
} as const;

export async function get<T>(key: string) {
  const result = await browser.storage.local.get(key);
  return result[key] as T;
}

export async function set(key: string, value: any) {
  return await browser.storage.local.set({ [key]: value });
}

export async function remove(key: string) {
  return await browser.storage.local.remove(key);
}

export async function watch(key: string, callback: (value: any) => void) {
  return await browser.storage.local.onChanged.addListener((changes) => {
    if (changes[key]) {
      callback(changes[key].newValue);
    }
  });
}

export async function unwatch(key: string, callback: (value: any) => void) {
  return await browser.storage.local.onChanged.removeListener(callback);
}
