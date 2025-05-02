import { FloatingPopup } from "@/components/content/FloatingPopup";
import type { Language } from "@/types";
import { Theme, TriggerPosition } from "@/types";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { createShadowRootUi } from "wxt/client";
import { defineContentScript } from "wxt/sandbox";
import { CustomPopup } from "~/components/content/custom-popup";
import i18n from "~/i18n";
import { useTranslation } from "~/i18n/hooks";
import { StorageKey, get, unwatch, watch } from "~/lib/localStorage";
import { Message, addMessageListener, removeMessageListener } from "~/lib/messaging";
import { cn } from "~/lib/utils";
import { pixelsToPercentage } from "~/lib/utils/coordinates";
import { PinnedBtn } from "~/components/content/pinned-btn";
import { UnderMouseBtn } from "~/components/content/under-mouse-btn";
import { useTextSelector } from "~/hooks/useTextSelector";
import { useScrollClose } from "~/hooks/useScrollClose";

import "~/assets/styles/globals.css";

interface CustomPopupState {
  x: number;
  y: number;
}

const ContentScriptUI = () => {
  const { changeLanguage } = useTranslation();
  const { textSelectorState, clearSelection } = useTextSelector();

  const [showFloatingPopup, setShowFloatingPopup] = useState<boolean>(false);
  const [showUnderMouseBtn, setShowUnderMouseBtn] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [customPopupState, setCustomPopupState] = useState<CustomPopupState | null>(null);
  const [triggerPosition, setTriggerPosition] = useState<TriggerPosition>(TriggerPosition.UNDER_CURSOR);

  async function getLanguage() {
    const language = await get<Language>(StorageKey.LANGUAGE);
    if (language) {
      changeLanguage(language.value);
    }
  }

  async function getTheme() {
    const theme = await get<Theme>(StorageKey.THEME);
    if (theme) {
      setTheme(theme);
    }
  }

  async function getTriggerPosition() {
    const triggerPosition = await get<TriggerPosition>(StorageKey.TRIGGER_POSITION);
    if (triggerPosition) {
      setTriggerPosition(triggerPosition);
    }
  }

  function onCloseAll() {
    clearSelection();
    setCustomPopupState(null);
    setShowUnderMouseBtn(false);
    setShowFloatingPopup(false);
  }

  useEffect(() => {
    if (textSelectorState) {
      setShowUnderMouseBtn(true);
    } else {
      setShowUnderMouseBtn(false);
      setShowFloatingPopup(false);
    }
  }, [textSelectorState]);

  function onOpenFloatingPopup() {
    setShowFloatingPopup(true);
    setShowUnderMouseBtn(false);
  }

  function onOpenCustomPopup() {
    setCustomPopupState((prev) => {
      if (prev) return null;
      const x = window.innerWidth - 16;
      const y = 16;
      return pixelsToPercentage({ x, y });
    });
  }

  useScrollClose({
    onClose: onCloseAll,
    threshold: 50,
  });

  useEffect(() => {
    getLanguage();
    getTheme();
    getTriggerPosition();
    watch(StorageKey.LANGUAGE, getLanguage);
    watch(StorageKey.THEME, getTheme);
    watch(StorageKey.TRIGGER_POSITION, getTriggerPosition);
    addMessageListener(Message.OPEN_CUSTOM_POPUP, onOpenCustomPopup);

    return () => {
      unwatch(StorageKey.LANGUAGE, getLanguage);
      unwatch(StorageKey.THEME, getTheme);
      unwatch(StorageKey.TRIGGER_POSITION, getTriggerPosition);
      removeMessageListener(Message.OPEN_CUSTOM_POPUP, onOpenCustomPopup);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div
        className={cn("content-script-ui", {
          dark:
            theme === Theme.DARK ||
            (theme === Theme.SYSTEM &&
              window.matchMedia("(prefers-color-scheme: dark)").matches),
        })}
      >
        {customPopupState && (
          <CustomPopup
            x={customPopupState.x}
            y={customPopupState.y}
            onClose={() => setCustomPopupState(null)}
          />
        )}
        {showFloatingPopup && textSelectorState && (
          <FloatingPopup
            question={textSelectorState.text}
            context={textSelectorState.context}
            x={textSelectorState.x}
            y={textSelectorState.y}
            onClose={onCloseAll}
          />
        )}
        {triggerPosition === TriggerPosition.UNDER_CURSOR && showUnderMouseBtn && textSelectorState && (
          <UnderMouseBtn x={textSelectorState.x} y={textSelectorState.y} onClick={onOpenFloatingPopup} />
        )}
        {triggerPosition === TriggerPosition.PINNED_RIGHT_SIDE && (
          <PinnedBtn />
        )}
      </div>
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
      mode: "closed",
      css: `
        :host {
          visibility: visible !important;
        }
      `,
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
