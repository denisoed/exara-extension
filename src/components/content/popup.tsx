import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { StorageKey, useStorage } from "@/lib/storage";
import { Theme } from "@/types";
import { Button } from "~/components/ui/button";
import { Message, addMessageListener, sendMessageToBackground } from "~/lib/messaging";
import { cn } from "~/lib/utils";
import Logo from "~/assets/logo.svg?react";
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
  Question = "question",
  Loading = "loading",
  Answer = "answer",
}

const Loading = ({ t }: { t: TFunction }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Loader2 className="size-4 animate-spin text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{t("contentScript.loading")}</span>
    </div>
  );
};

const Question = ({ onClick, t }: { onClick: () => void; t: TFunction }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full gap-2"
      onClick={onClick}
    >
      <Logo className="size-4" />
      <span className="text-sm text-muted-foreground">{t("contentScript.question")}</span>
    </Button>
  );
};

const Answer = ({
  question,
  answer,
  onClose,
  t,
}: { question: string; answer: string; onClose: () => void; t: TFunction }) => {
  return (
    <div className="flex flex-col gap-2 text-muted-foreground">
      <div className="rounded-md bg-muted p-3">
        <p className="text-sm">{answer}</p>
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
        {t("contentScript.close")}
      </Button>
    </div>
  );
};

export const ContentPopup = forwardRef<HTMLDivElement, ContentPopupProps>(
  ({ question, context, x, y, onClose }, ref) => {
    const { data: theme } = useStorage(StorageKey.THEME);
    const [state, setState] = useState<PopupState>(PopupState.Question);
    const [answer, setAnswer] = useState<string>("");
    const { t } = useTranslation();

    const handleQuestionClick = async () => {
      setState(PopupState.Loading);
      sendMessageToBackground(Message.GET_SELECTION_TEXT, { question, context });
    };

    useEffect(() => {
      addMessageListener(Message.GET_ANSWER, (data) => {
        setAnswer(data);
        setState(PopupState.Answer);
      });
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex max-w-[500px] flex-col gap-2 rounded-md border bg-background p-3 shadow-lg",
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
        {state === PopupState.Question && (
          <Question onClick={handleQuestionClick} t={t} />
        )}

        {state === PopupState.Loading && <Loading t={t} />}

        {state === PopupState.Answer && (
          <Answer question={question} answer={answer} onClose={onClose} t={t} />
        )}
      </div>
    );
  },
);

ContentPopup.displayName = "ContentPopup";
