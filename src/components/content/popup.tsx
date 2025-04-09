import { HelpCircle, Loader2 } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Message, addMessageListener, sendMessage } from "~/lib/messaging";
import { cn } from "~/lib/utils";

interface ContentPopupProps {
  question: string;
  x: number;
  y: number;
  onClose: () => void;
}

enum PopupState {
  Question = "question",
  Loading = "loading",
  Answer = "answer",
}

const Loading = () => {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Loader2 className="size-4 animate-spin" />
      <span className="text-sm text-muted-foreground">Getting answer...</span>
    </div>
  );
};

const Question = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full gap-2"
      onClick={onClick}
    >
      <HelpCircle className="size-4" />
      What is this?
    </Button>
  );
};

const Answer = ({
  question,
  answer,
  onClose,
}: { question: string; answer: string; onClose: () => void }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{question}</p>
      <div className="rounded-md bg-muted p-3">
        <p className="text-sm">{answer}</p>
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export const ContentPopup = forwardRef<HTMLDivElement, ContentPopupProps>(
  ({ question, x, y, onClose }, ref) => {
    const [state, setState] = useState<PopupState>(PopupState.Question);
    const [answer, setAnswer] = useState<string>("");

    const handleQuestionClick = async () => {
      setState(PopupState.Loading);
      sendMessage(Message.GET_SELECTION_TEXT, question);
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
          "fixed z-50 flex flex-col gap-2 rounded-md border bg-background p-4 shadow-lg",
        )}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {state === PopupState.Question && (
          <Question onClick={handleQuestionClick} />
        )}

        {state === PopupState.Loading && <Loading />}

        {state === PopupState.Answer && (
          <Answer question={question} answer={answer} onClose={onClose} />
        )}
      </div>
    );
  },
);

ContentPopup.displayName = "ContentPopup";
