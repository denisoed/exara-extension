import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle, MessageCircleMore } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ExplanationStyle } from "~/types";

export const Controls = ({
  isExpanded,
  handleClarification,
  handleExplain,
}: {
  isExpanded: boolean;
  handleClarification: () => void;
  handleExplain: (style: ExplanationStyle) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 bg-accent"
        onClick={handleClarification}
      >
        <MessageCircleMore className="size-4 mr-2" />
        {t("contentScript.needClarification")}
      </Button>
      {!isExpanded && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 bg-accent">
              <HelpCircle className="size-4 mr-2" />
              {t("contentScript.explainLikeChild")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Array.from(Object.values(ExplanationStyle)).map((style) => (
              <DropdownMenuItem
                key={style}
                onClick={() => handleExplain(style)}
              >
                {t(`contentScript.explainStyles.${style}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

Controls.displayName = "Controls";
