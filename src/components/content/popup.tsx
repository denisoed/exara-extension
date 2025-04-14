import { Loader2, X, Move } from "lucide-react";
import { forwardRef, useEffect, useState, useCallback } from "react";
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
  answer,
}: { 
  answer: string; 
}) => {
  return (
    <div className="flex flex-col gap-2 text-black dark:text-white">
      <div className="rounded-md bg-muted p-3">
        <p className="text-sm">{answer}</p>
      </div>
    </div>
  );
};

export const ContentPopup = forwardRef<HTMLDivElement, ContentPopupProps>(
  ({ question, context, x, y, onClose }, ref) => {
    const { data: theme } = useStorage(StorageKey.THEME);
    const [state, setState] = useState<PopupState>(PopupState.Loading);
    const [answer, setAnswer] = useState<string>("");
    const { t } = useTranslation();
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
      sendMessageToBackground(Message.GET_SELECTION_TEXT, { question, context });
      addMessageListener(Message.GET_ANSWER, (data) => {
        setAnswer(data);
        setState(PopupState.Answer);
      });
    }, []);

    const handleDragStart = useCallback((e: React.MouseEvent) => {
      setIsDragging(true);
      // Calculate offset based on the difference between mouse position and popup position
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate new position based on mouse position and offset
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Ensure popup stays within viewport
      const maxX = window.innerWidth - 400; // 400px is the popup width
      const maxY = window.innerHeight - 200; // Approximate popup height

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    }, [isDragging, dragOffset]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg",
          {
            dark:
              theme === Theme.DARK ||
              (theme === Theme.SYSTEM &&
                window.matchMedia("(prefers-color-scheme: dark)").matches),
          },
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            variant="outline"
            size="xs"
            className="rounded-full cursor-move"
            onMouseDown={handleDragStart}
          >
            <Move className="size-3" />
          </Button>
          <Button variant="outline" size="xs" className="rounded-full" onClick={onClose}>
            <X className="size-3" />
          </Button>
        </div>
  
        {state === PopupState.Loading && <Loading t={t} />}

        {state === PopupState.Answer && (
          <Answer 
            answer={answer} 
          />
        )}
      </div>
    );
  },
);

ContentPopup.displayName = "ContentPopup";
