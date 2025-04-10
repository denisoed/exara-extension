import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createShadowRootUi } from "wxt/client";
import { defineContentScript } from "wxt/sandbox";
import { ContentPopup } from "~/components/content/popup";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { useTranslation } from "~/i18n/hooks";

import { get, StorageKey, watch, unwatch } from "~/lib/localStorage";

import "~/assets/styles/globals.css";
import { Language } from "@/types";

interface PopupState {
  text: string;
  x: number;
  y: number;
}

function getSelection() {
  const selectedText = window.getSelection()?.toString().trim();
  return selectedText;
}

function isPopup(target: EventTarget | null) {
  return target instanceof HTMLElement && target.tagName === "EXTRO-UI";
}


const ContentScriptUI = () => {
  const [popupState, setPopupState] = useState<PopupState | null>(null);
  const { changeLanguage } = useTranslation();
  
  async function getLanguage() {
    const language = await get<Language>(StorageKey.LANGUAGE);
    if (language) {
      changeLanguage(language.value);
    }
  }

  function onClick(event: MouseEvent) {
    if (isPopup(event.target)) {
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();
    if (!selectedText) {
      setPopupState(null);
    }
  }

  function onMouseUp(event: MouseEvent) {
    if (isPopup(event.target)) {
      return;
    }

    const selectedText = getSelection();
    if (selectedText) {
      setPopupState({
        text: selectedText,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  useEffect(() => {
    getLanguage();
    watch(StorageKey.LANGUAGE, getLanguage);

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("click", onClick);
      unwatch(StorageKey.LANGUAGE, getLanguage);
    };
  }, []);

  if (!popupState) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <ContentPopup
        question={popupState.text}
        x={popupState.x}
        y={popupState.y}
        onClose={() => setPopupState(null)}
      />
    </I18nextProvider>
  );
};

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log(
      "Content script is running! Edit `src/app/content` and save to reload.",
    );

    const ui = await createShadowRootUi(ctx, {
      name: "extro-ui",
      position: "overlay",
      anchor: "body",
      onMount: (container) => {
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<ContentScriptUI />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
