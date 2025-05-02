import { DraggleWrapper } from "~/components/common/DraggleWrapper";
import { Answer } from "~/components/content/FloatingPopup/Answer";
import { PopupWrapper } from "~/components/content/FloatingPopup/popup-wrapper";
import { forwardRef, useEffect, useState } from "react";
import {
  Message,
  addMessageListener,
  sendMessageToBackground,
} from "~/lib/messaging";
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

    const handleRequestAnswer = () => {
      sendMessageToBackground(Message.GET_SELECTION_TEXT, {
        question,
        context,
      });
      setState(FloatingPopupState.Loading);
    };

    // ------ HOOKS ------ //
    useEffect(() => {
      handleRequestAnswer();

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

      addMessageListener(Message.LIMIT_REACHED, () => {
        setState(FloatingPopupState.LimitReached);
      });
    }, []);

    return (
      <DraggleWrapper x={x} y={y} ref={ref}>
        <PopupWrapper onClose={onClose}>
          <Answer
            answer={answer}
            limitReached={state === FloatingPopupState.LimitReached}
            isLoading={state === FloatingPopupState.Loading}
            onClarify={handleClarification}
            onExplain={handleExplain}
            clarificationCount={clarificationCount}
            clarificationHistory={clarificationHistory}
          />
        </PopupWrapper>
      </DraggleWrapper>
    );
  },
);

FloatingPopup.displayName = "FloatingPopup";
