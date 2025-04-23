import { Move, X } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { ThemeSwitch } from "~/components/common/theme";
import { LanguageSwitcher } from "~/components/content/language-switcher";
import { ScrollCloseSwitch } from "~/components/content/scroll-close-switch";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface CustomPopupProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const CustomPopup = forwardRef<HTMLDivElement, CustomPopupProps>(
  ({ x, y, onClose }, ref) => {
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

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
      // Trigger animation after component mount
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-[999999999] flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg rounded-[16px] text-base text-foreground",
          "transition-transform duration-300 ease-out",
          "transform origin-center",
          {
            "translate-y-[-100px] opacity-0": !isVisible,
            "translate-y-0 opacity-100": isVisible,
          },
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div 
          className="absolute left-0 right-0 top-0 h-10 cursor-move rounded-t-[16px]" 
          onMouseDown={handleDragStart}
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <ThemeSwitch />
          <Button
            variant="outline"
            size="xs"
            className="rounded-full cursor-move bg-accent"
            onMouseDown={handleDragStart}
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
      </div>
    );
  },
);

CustomPopup.displayName = "CustomPopup";
