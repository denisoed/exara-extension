import { Button } from "@/components/ui/button";
import type { ClarificationHistory, ExplanationStyle } from "@/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clarifications } from "~/components/content/FloatingPopup/Answer/clarifications";
import { Controls } from "~/components/content/FloatingPopup/Answer/controls";
import { Form } from "~/components/content/FloatingPopup/Answer/form";
import { Loading } from "~/components/content/FloatingPopup/loading";

export const Answer = ({
  answer,
  isLoading,
  onClarify,
  onExplain,
  clarificationCount,
  clarificationHistory,
  limitReached,
}: {
  answer: string;
  isLoading: boolean;
  onClarify: (question: string) => void;
  onExplain: (style: ExplanationStyle) => void;
  clarificationCount: number;
  clarificationHistory: ClarificationHistory[];
  limitReached: boolean;
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[8px] bg-popover p-2 text-black dark:text-white">
        <Loading />
      </div>
    );
  }

  if (limitReached) {
    return (
      <div className="rounded-[8px] bg-popover p-2 text-black dark:text-white">
        <p className="text-sm text-yellow-500">{t("contentScript.limitReached")}</p>
        <Button
          onClick={() => window.open("https://exara.pro/#pricing", "_blank")}
          variant="outline"
          size="sm"
          className="mt-2 w-full"
        >
          {t("contentScript.resetLimit")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-black dark:text-white">
      {!!answer || clarificationHistory.length ? (
        <div className="max-h-[500px] overflow-y-auto pr-2 rounded-[8px] bg-popover p-3">
          <div className="space-y-2">
            <p className="text-sm">{answer}</p>
            <Clarifications clarificationHistory={clarificationHistory} />
          </div>
        </div>
      ) : null}

      {canClarify && (
        <div className="space-y-2 rounded-[8px] bg-popover p-2">
          <Controls
            isExpanded={isExpanded}
              handleClarification={() => setIsExpanded(!isExpanded)}
              handleExplain={handleExplain}
            />

            {isExpanded && (
              <Form
                clarificationText={clarificationText}
                setClarificationText={setClarificationText}
                handleKeyDown={handleKeyDown}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        )}
    </div>
  );
};
