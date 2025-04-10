import { browser } from "wxt/browser";

export const StorageKey = {
  LANGUAGE: "local:language",
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
