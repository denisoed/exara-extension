import { Move, X } from "lucide-react";
import { forwardRef } from "react";
import { DraggleWrapper } from "~/components/common/DraggleWrapper";
import { ThemeSwitch } from "~/components/common/theme";
import { TokenInput } from "~/components/content/TokenInput";
import { LanguageSwitcher } from "~/components/content/language-switcher";
import { ScrollCloseSwitch } from "~/components/content/scroll-close-switch";
import { Button } from "~/components/ui/button";

interface CustomPopupProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const CustomPopup = forwardRef<HTMLDivElement, CustomPopupProps>(
  ({ x, y, onClose }, ref) => {

    return (
      <DraggleWrapper x={x} y={y} ref={ref}>
        <div className="flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg rounded-[16px] text-base text-foreground">
          <div
            className="absolute left-0 right-0 top-0 h-10 cursor-move rounded-t-[16px]"
            data-draggle-wrapper
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <ThemeSwitch />
            <Button
              variant="outline"
              size="xs"
              className="rounded-full cursor-move bg-accent"
              data-draggle-wrapper
            >
              <Move className="size-2 text-muted-foreground" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="rounded-full bg-accent"
              onClick={onClose}
            >
              <X className="size-3 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex flex-col gap-2 bg-popover rounded-[8px] p-2">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-2 bg-popover rounded-[8px] p-2">
            <ScrollCloseSwitch />
          </div>
          <div className="flex flex-col gap-2 bg-popover rounded-[8px] p-2">
            <TokenInput />
          </div>
        </div>
      </DraggleWrapper>
    );
  },
);

CustomPopup.displayName = "CustomPopup";
