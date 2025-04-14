import { Loader2, X } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { StorageKey, useStorage } from "@/lib/storage";
import { Theme } from "@/types";
import { Button } from "~/components/ui/button";
import { Message, addMessageListener, sendMessageToBackground } from "~/lib/messaging";
import { cn } from "~/lib/utils";
import { useTranslation } from "~/i18n/hooks";
import { TFunction } from "i18next";

interface ContentPopupProps {
  question: string;
  context: string;
  x: number;
  y: number;
  onClose: () => void;
}

enum PopupState {
  Loading = "loading",
  Answer = "answer",
}

const Loading = ({ t }: { t: TFunction }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-2 bg-muted">
      <Loader2 className="size-4 animate-spin text-black dark:text-white" />
      <span className="text-sm text-black dark:text-white">{t("contentScript.loading")}</span>
    </div>
  );
};

const Answer = ({
  question,
  answer,
  onClose,
  t,
}: { question: string; answer: string; onClose: () => void; t: TFunction }) => {
  return (
    <div className="flex flex-col gap-2 text-black dark:text-white">
      <div className="rounded-md bg-muted p-3">
        <p className="text-sm">{answer}</p>
      </div>
      <Button variant="outline" size="xs" className="absolute right-2 top-2 rounded-full" onClick={onClose}>
        <X className="size-3" />
      </Button>
    </div>
  );
};

export const ContentPopup = forwardRef<HTMLDivElement, ContentPopupProps>(
  ({ question, context, x, y, onClose }, ref) => {
    const { data: theme } = useStorage(StorageKey.THEME);
    const [state, setState] = useState<PopupState>(PopupState.Loading);
    const [answer, setAnswer] = useState<string>("");
    const { t } = useTranslation();

    useEffect(() => {
      sendMessageToBackground(Message.GET_SELECTION_TEXT, { question, context });
      addMessageListener(Message.GET_ANSWER, (data) => {
        setAnswer(data);
        setState(PopupState.Answer);
      });
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 shadow-lg",
          {
            dark:
              theme === Theme.DARK ||
              (theme === Theme.SYSTEM &&
                window.matchMedia("(prefers-color-scheme: dark)").matches),
          },
        )}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {state === PopupState.Loading && <Loading t={t} />}

        {state === PopupState.Answer && (
          <Answer question={question} answer={answer} onClose={onClose} t={t} />
        )}
      </div>
    );
  },
);

ContentPopup.displayName = "ContentPopup";
