import { Loader2, X, Move, MessageCircleMore, HelpCircle } from "lucide-react";
import Logo from "~/assets/logo.svg?react";
import { forwardRef, useEffect, useState, useCallback } from "react";
import { StorageKey, useStorage } from "@/lib/storage";
import { Theme } from "@/types";
import { Button } from "~/components/ui/button";
import { Message, addMessageListener, sendMessageToBackground } from "~/lib/messaging";
import { cn } from "~/lib/utils";
import { Textarea } from "~/components/ui/textarea";
import { useTranslation } from "~/i18n/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

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

enum ExplanationStyle {
  CHILD = "child",
  STUDENT = "student",
  BEGINNER = "beginner",
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
    <div className="flex items-center justify-center gap-2 bg-popover rounded-[8px]">
      <Loader2 className="size-4 animate-spin text-black dark:text-white" />
      <span className="text-sm text-black dark:text-white">{t("contentScript.loading")}</span>
    </div>
  );
};

interface ClarificationHistory {
  question: string;
  answer: string;
}

const Answer = ({
  answer,
  isLoading,
  onClarify,
  onExplain,
  clarificationCount,
  clarificationHistory,
}: { 
  answer: string;
  isLoading: boolean;
  onClarify: (question: string) => void;
  onExplain: (style: ExplanationStyle) => void;
  clarificationCount: number;
  clarificationHistory: ClarificationHistory[];
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [clarificationText, setClarificationText] = useState("");
  const canClarify = clarificationCount < 2;

  const handleSubmit = () => {
    if (clarificationText.trim()) {
      onClarify(clarificationText);
      setClarificationText("");
      setIsExpanded(false);
    }
  };

  const handleExplain = (style: ExplanationStyle) => {
    onExplain(style);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2 text-black dark:text-white">
      {(!!answer || clarificationHistory.length) ? (
        <div className="max-h-[500px] overflow-y-auto pr-2 rounded-[8px] bg-popover p-3">
            <div className="space-y-2">
              <p className="text-sm">{answer}</p>
                
              {clarificationHistory.map((item, index) => (
                <div key={index} className="mt-3 border-t pt-3 space-y-2">
                  <p className="text-sm text-muted-foreground italic">
                    {t("contentScript.clarificationQuestion")}: {item.question}
                  </p>
                  <p className="text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
        </div>
      ) : null}

      {isLoading && <div className="rounded-[8px] bg-popover p-2"><Loading /></div> ||
        canClarify && (
          <div className="space-y-2 rounded-[8px] bg-popover p-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <MessageCircleMore className="size-4 mr-2" />
                {t("contentScript.needClarification")}
              </Button>
              {!isExpanded && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <HelpCircle className="size-4 mr-2" />
                    {t("contentScript.explainLikeChild")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExplain(ExplanationStyle.CHILD)}>
                    {t("contentScript.explainStyles.child")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExplain(ExplanationStyle.STUDENT)}>
                    {t("contentScript.explainStyles.student")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExplain(ExplanationStyle.BEGINNER)}>
                    {t("contentScript.explainStyles.beginner")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
            </div>

            {isExpanded && (
              <div className="space-y-2">
                <Textarea
                  value={clarificationText}
                  onChange={(e) => setClarificationText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[80px] p-2 text-sm rounded-md border bg-background resize-none"
                  placeholder={t("contentScript.typeClarification")}
                  autoFocus
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    className="bg-accent-gradient text-white min-w-[100px]"
                    disabled={!clarificationText.trim()}
                  >
                    {t("contentScript.send")}
                  </Button>
                </div>
              </div>
            )}
          </div>
      )}
    </div>
  );
};

const Popup = ({ 
  state, 
  answer, 
  onClose, 
  handleDragStart,
  onClarify,
  onExplain,
  clarificationCount,
  clarificationHistory,
}: { 
  state: PopupState, 
  answer: string, 
  onClose: () => void, 
  handleDragStart: (e: React.MouseEvent) => void,
  onClarify: (question: string) => void;
  onExplain: (style: ExplanationStyle) => void;
  clarificationCount: number;
  clarificationHistory: ClarificationHistory[];
}) => {
  return (
    <div
      className={cn(
        "flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg rounded-[16px]",
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

      <Answer 
        answer={answer}
        isLoading={state === PopupState.Loading}
        onClarify={onClarify}
        onExplain={onExplain}
        clarificationCount={clarificationCount}
        clarificationHistory={clarificationHistory}
      />
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
    const [clarificationCount, setClarificationCount] = useState(0);
    const [clarificationHistory, setClarificationHistory] = useState<ClarificationHistory[]>([]);

    const handleClarification = (clarificationQuestion: string) => {
      setState(PopupState.Loading);
      sendMessageToBackground(Message.GET_CLARIFICATION, {
        originalQuestion: question,
        originalAnswer: answer,
        clarificationQuestion,
        context,
      });
    };

    const handleExplain = (style: ExplanationStyle) => {
      setState(PopupState.Loading);
      sendMessageToBackground(Message.EXPLAIN_LIKE_CHILD, {
        question,
        context,
        style,
      });
    };

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
      addMessageListener(Message.GET_ANSWER, (data) => {
        setAnswer(data);
        setState(PopupState.Answer);
      });

      addMessageListener(Message.GET_CLARIFICATION_ANSWER, (data) => {
        setClarificationHistory(prev => [...prev, {
          question: data.clarificationQuestion,
          answer: data.answer
        }]);
        setClarificationCount(prev => prev + 1);
        setState(PopupState.Answer);
      });

      addMessageListener(Message.GET_EXPLAIN_SIMPLER, (data) => {
        setAnswer(data);
        setState(PopupState.Answer);
      });

      // Trigger animation after component mount
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-[999999999]",
          "transition-transform duration-300 ease-out",
          "transform origin-center",
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
            onClarify={handleClarification}
            onExplain={handleExplain}
            clarificationCount={clarificationCount}
            clarificationHistory={clarificationHistory}
          />
        }
      </div>
    );
  },
);

ContentPopup.displayName = "ContentPopup";
