import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Context } from "~/types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function getSelection() {
  const selectedText = window.getSelection()?.toString().trim();
  return selectedText;
}

export function getPageContext(): Context {
  const pageTitle = document.title || "";
  const pageDescription = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content") || "";
  return { pageTitle, pageDescription };
}

export function isExaraContainer(target: EventTarget | null) {
  return target instanceof HTMLElement && target.tagName === "EXARA-UI";
}
