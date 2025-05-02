import { GripVerticalIcon } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { DraggleWrapper } from "~/components/common/DraggleWrapper";
import Logo from "~/assets/logo.svg?react";
import { cn } from "@/lib/utils";
import { isExaraContainer } from "@/lib/utils";
import { set, get, StorageKey } from "@/lib/localStorage";

export const PinnedBtn = forwardRef<HTMLDivElement>(
  (_, ref) => {

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 50 });

    // Close the menu when clicking outside the menu
    function handleClick(e: MouseEvent) {
      if (!isExaraContainer(e.target)) {
        setIsOpen(false);
      }
    }

    function handleChange(x: number, y: number) {
      set(StorageKey.PINNED_BTN_POSITION, { x, y: Math.round(y) });
    }

    async function getPinnedBtnPosition() {
      const pinnedBtnPosition = await get<{ x: number; y: number }>(
        StorageKey.PINNED_BTN_POSITION,
      );
      if (pinnedBtnPosition) {
        console.log(pinnedBtnPosition);
        setPosition({
          x: pinnedBtnPosition.x,
          y: pinnedBtnPosition.y,
        });
      }
    }

    useEffect(() => {
      getPinnedBtnPosition();
      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    }, []);

    return (
      <DraggleWrapper x={position.x} y={position.y} ref={ref} disableX onChange={handleChange}>
        <div
          className={cn(
            "flex items-center gap-1 bg-background shadow-lg rounded-l-[16px] text-base text-foreground translate-x-[40%] cursor-pointer opacity-50 transition-all duration-300",
            isOpen && "translate-x-0 opacity-100",
          )}
        >
          <Logo onClick={() => setIsOpen(!isOpen)} className="size-10 py-3 text-muted-foreground" />
          <div data-draggle-wrapper className="flex items-center justify-center py-3 pr-2">
            <GripVerticalIcon className="size-3 text-muted-foreground" />
          </div>
        </div>
      </DraggleWrapper>
    );
  },
);

PinnedBtn.displayName = "PinnedBtn";
