import { Loader2, X, Move } from "lucide-react";
import Logo from "~/assets/logo.svg?react";
import { forwardRef, useEffect, useState, useCallback } from "react";
import { StorageKey, useStorage } from "@/lib/storage";
import { Theme } from "@/types";
import { Button } from "~/components/ui/button";
import { Message, addMessageListener, sendMessageToBackground } from "~/lib/messaging";
import { cn } from "~/lib/utils";
import { useTranslation } from "~/i18n/hooks";

interface ContentPopupProps {
  question: string;
  context: string;
  x: number;
  y: number;
  onClose: () => void;
}

enum PopupState {
  Preview = "preview",
  Loading = "loading",
  Answer = "answer",
}

const ActionBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outline" size="xs" className="rounded-full shadow-lg" onClick={onClick}>
      <Logo className="size-3 text-muted-foreground" />
    </Button>
  );
};

const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-2 py-2 bg-muted rounded-[8px]">
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
    <div className="flex flex-col gap-2 text-black dark:text-white rounded-[8px] bg-muted p-3">
      <p className="text-sm">{answer}</p>
    </div>
  );
};

const Popup = ({ state, answer, onClose, handleDragStart }: { state: PopupState, answer: string, onClose: () => void, handleDragStart: (e: React.MouseEvent) => void }) => {
  return (
    <div
      className={cn(
        "flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg rounded-[16px]",
        "transition-transform duration-300 ease-out",
        "transform origin-center",
      )}
    >
      <div className="absolute right-2 top-2 flex gap-1">
        <Button
          variant="outline"
          size="xs"
          className="rounded-full cursor-move"
          onMouseDown={handleDragStart}
        >
          <Move className="size-2 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="xs" className="rounded-full" onClick={onClose}>
          <X className="size-3 text-muted-foreground" />
        </Button>
      </div>

      {state === PopupState.Loading && <Loading />}

      {state === PopupState.Answer && (
        <Answer 
          answer={answer} 
        />
      )}
    </div>
  )
}

export const ContentPopup = forwardRef<HTMLDivElement, ContentPopupProps>(
  ({ question, context, x, y, onClose }, ref) => {
    const { data: theme } = useStorage(StorageKey.THEME);
    const [state, setState] = useState<PopupState>(PopupState.Preview);
    const [answer, setAnswer] = useState<string>("");
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

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

    const handleRequestAnswer = () => {
      sendMessageToBackground(Message.GET_SELECTION_TEXT, { question, context });
      setState(PopupState.Loading);
    };

    // ------ HOOKS ------ //

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

    useEffect(() => {
      // Trigger animation after component mount
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, []);

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
          "fixed z-50",
          {
            "scale-90 opacity-0": !isVisible,
            "scale-100 opacity-100": isVisible,
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
        {state === PopupState.Preview && <ActionBtn onClick={handleRequestAnswer} /> ||
          <Popup
            state={state}
            answer={answer}
            onClose={onClose}
            handleDragStart={handleDragStart}
          />
        }
      </div>
    );
  },
);

ContentPopup.displayName = "ContentPopup";
