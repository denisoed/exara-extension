import { Answer } from "@/components/content/FloatingPopup/Answer";
import { ActionBtn } from "@/components/content/FloatingPopup/action-btn";
import { PopupWrapper } from "@/components/content/FloatingPopup/popup-wrapper";;
import { forwardRef, useCallback, useEffect, useState } from "react";
import {
  Message,
  addMessageListener,
  sendMessageToBackground,
} from "~/lib/messaging";
import { cn } from "~/lib/utils";
import {
  type ClarificationHistory,
  type ExplanationStyle,
  FloatingPopupState,
} from "~/types";

interface FloatingPopupProps {
  question: string;
  context: string;
  x: number;
  y: number;
  onClose: () => void;
}

export const FloatingPopup = forwardRef<HTMLDivElement, FloatingPopupProps>(
  ({ question, context, x, y, onClose }, ref) => {
    const [state, setState] = useState<FloatingPopupState>(
      FloatingPopupState.Preview,
    );
    const [answer, setAnswer] = useState<string>("");
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [clarificationCount, setClarificationCount] = useState(0);
    const [clarificationHistory, setClarificationHistory] = useState<
      ClarificationHistory[]
    >([]);

    const handleClarification = (clarificationQuestion: string) => {
      setState(FloatingPopupState.Loading);
      sendMessageToBackground(Message.GET_CLARIFICATION, {
        originalQuestion: question,
        originalAnswer: answer,
        clarificationQuestion,
        context,
      });
    };

    const handleExplain = (style: ExplanationStyle) => {
      setState(FloatingPopupState.Loading);
      setClarificationHistory([]);
      setClarificationCount(0);
      sendMessageToBackground(Message.EXPLAIN_LIKE_CHILD, {
        question,
        context,
        style,
      });
    };

    const handleDragStart = useCallback(
      (e: React.MouseEvent) => {
        setIsDragging(true);
        // Calculate offset based on the difference between mouse position and popup position
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      },
      [position],
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
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
      },
      [isDragging, dragOffset],
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleRequestAnswer = () => {
      sendMessageToBackground(Message.GET_SELECTION_TEXT, {
        question,
        context,
      });
      setState(FloatingPopupState.Loading);
    };

    // ------ HOOKS ------ //

    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
      addMessageListener(Message.GET_ANSWER, (data) => {
        setAnswer(data);
        setState(FloatingPopupState.Answer);
      });

      addMessageListener(Message.GET_CLARIFICATION_ANSWER, (data) => {
        setClarificationHistory((prev) => [
          ...prev,
          {
            question: data.clarificationQuestion,
            answer: data.answer,
          },
        ]);
        setClarificationCount((prev) => prev + 1);
        setState(FloatingPopupState.Answer);
      });

      addMessageListener(Message.GET_EXPLAIN_SIMPLER, (data) => {
        setAnswer(data);
        setState(FloatingPopupState.Answer);
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
          },
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {(state === FloatingPopupState.Preview && (
          <ActionBtn onClick={handleRequestAnswer} />
        )) || (
          <PopupWrapper onClose={onClose} handleDragStart={handleDragStart}>
            <Answer
              answer={answer}
              isLoading={state === FloatingPopupState.Loading}
              onClarify={handleClarification}
              onExplain={handleExplain}
              clarificationCount={clarificationCount}
              clarificationHistory={clarificationHistory}
            />
          </PopupWrapper>
        )}
      </div>
    );
  },
);

FloatingPopup.displayName = "FloatingPopup";
