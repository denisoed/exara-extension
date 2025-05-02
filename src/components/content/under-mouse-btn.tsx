import { forwardRef } from "react";
import { DraggleWrapper } from "~/components/common/DraggleWrapper";
import Logo from "~/assets/logo.svg?react";
import { Button } from "@/components/ui/button";

interface UnderMouseBtnProps {
  x: number;
  y: number;
  onClick: () => void;
}

export const UnderMouseBtn = forwardRef<HTMLDivElement, UnderMouseBtnProps>(
  ({ onClick, x, y }, ref) => {

    return (
      <DraggleWrapper x={x} y={y} ref={ref} disableX disableY>
        <Button
          variant="outline"
          size="xs"
          className="rounded-full shadow-lg"
          onClick={onClick}
        >
          <Logo className="size-3 text-muted-foreground" />
        </Button>
      </DraggleWrapper>
    );
  },
);

UnderMouseBtn.displayName = "UnderMouseBtn";
