import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

export const Form = ({
  clarificationText,
  setClarificationText,
  handleKeyDown,
  handleSubmit,
}: {
  clarificationText: string;
  setClarificationText: (text: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSubmit: () => void;
}) => {
  const { t } = useTranslation();
  return (
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
  );
};

Form.displayName = "Form";
