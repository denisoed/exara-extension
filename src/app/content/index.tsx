import { FloatingPopup } from "@/components/content/FloatingPopup";
import type { Language } from "@/types";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { createShadowRootUi } from "wxt/client";
import { defineContentScript } from "wxt/sandbox";
import { CustomPopup } from "~/components/content/custom-popup";
import i18n from "~/i18n";
import { useTranslation } from "~/i18n/hooks";
import { StorageKey, get, unwatch, watch } from "~/lib/localStorage";
import { Message, addMessageListener } from "~/lib/messaging";
import { getPageContext, getSelection, isPopup } from "~/lib/utils";
import "~/assets/styles/globals.css";

interface PopupState {
  text: string;
  context: string;
  x: number;
  y: number;
}

interface CustomPopupState {
  x: number;
  y: number;
}

const ContentScriptUI = () => {
  const SCROLL_THRESHOLD = 50; // pixels
  let lastScrollY = window.scrollY;
  const [popupState, setPopupState] = useState<PopupState | null>(null);
  const [customPopupState, setCustomPopupState] =
    useState<CustomPopupState | null>(null);
  const { changeLanguage } = useTranslation();

  async function getLanguage() {
    const language = await get<Language>(StorageKey.LANGUAGE);
    if (language) {
      changeLanguage(language.value);
    }
  }

  function onMouseUp(event: MouseEvent) {
    if (isPopup(event.target)) {
      return;
    }

    const selectedText = getSelection();
    const context = getPageContext();

    if (selectedText) {
      setPopupState({
        text: selectedText,
        context: `${context.pageTitle} - ${context.pageDescription}`,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function onMouseDown(event: MouseEvent) {
    if (isPopup(event.target)) {
      return;
    }

    setPopupState(null);
  }

  async function onScroll() {
    const isScrollCloseEnabled =
      (await get<boolean>(StorageKey.SCROLL_CLOSE)) || false;

    if (!isScrollCloseEnabled) {
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDiff = Math.abs(currentScrollY - lastScrollY);

    if (scrollDiff > SCROLL_THRESHOLD) {
      setPopupState(null);
      lastScrollY = currentScrollY;
    }
  }

  function onOpenCustomPopup() {
    const windowWidth = window.innerWidth;
    const customPopupWidth = 400;
    const x = windowWidth - customPopupWidth - 16;
    const y = 16;
    setCustomPopupState({
      x,
      y,
    });
  }

  useEffect(() => {
    getLanguage();
    watch(StorageKey.LANGUAGE, getLanguage);
    addMessageListener(Message.OPEN_CUSTOM_POPUP, onOpenCustomPopup);

    window.addEventListener("scroll", onScroll);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", onMouseDown);
      unwatch(StorageKey.LANGUAGE, getLanguage);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {popupState && (
        <FloatingPopup
          question={popupState.text}
          context={popupState.context}
          x={popupState.x}
          y={popupState.y}
          onClose={() => setPopupState(null)}
        />
      )}
      {customPopupState && (
        <CustomPopup
          x={customPopupState.x}
          y={customPopupState.y}
          onClose={() => setCustomPopupState(null)}
        />
      )}
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
      name: "exara-ui",
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
