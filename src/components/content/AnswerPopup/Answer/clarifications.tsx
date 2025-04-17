import type { ClarificationHistory } from "@/types";
import { useTranslation } from "react-i18next";

export const Clarifications = ({
  clarificationHistory,
}: { clarificationHistory: ClarificationHistory[] }) => {
  const { t } = useTranslation();
  return (
    <>
      {clarificationHistory.map((item, index) => (
        <div key={index} className="mt-3 border-t pt-3 space-y-2">
          <p className="text-sm text-muted-foreground italic">
            {t("contentScript.clarificationQuestion")}: {item.question}
          </p>
          <p className="text-sm">{item.answer}</p>
        </div>
      ))}
    </>
  );
};

Clarifications.displayName = "Clarifications";
