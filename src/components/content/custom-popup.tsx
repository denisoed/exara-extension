import { X, Move } from "lucide-react";
import { forwardRef, useEffect, useState, useCallback } from "react";
import { StorageKey, useStorage } from "@/lib/storage";
import { Theme } from "@/types";
import { Button } from "~/components/ui/button";
import { LanguageSwitcher } from "~/components/content/language-switcher";
import { ThemeSwitch } from "~/components/common/theme";
import { cn } from "~/lib/utils";

interface CustomPopupProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const CustomPopup = forwardRef<HTMLDivElement, CustomPopupProps>(
  ({ x, y, onClose }, ref) => {
    const { data: theme } = useStorage(StorageKey.THEME);
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const handleDragStart = useCallback((e: React.MouseEvent) => {
      setIsDragging(true);
      // Calculate offset based on the difference between mouse position and popup position
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
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
    }, [isDragging, dragOffset]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // ------ HOOKS ------ //

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
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
          "fixed z-50 flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg rounded-[16px] text-base text-foreground",
          "transition-transform duration-300 ease-out",
          "transform origin-center",
          {
            "translate-y-[-100px] opacity-0": !isVisible,
            "translate-y-0 opacity-100": isVisible,
            dark:
              theme === Theme.DARK ||
              (theme === Theme.SYSTEM &&
                window.matchMedia("(prefers-color-scheme: dark)").matches),
          },
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="absolute right-2 top-2 flex gap-1">
          <ThemeSwitch />
          <Button
            variant="outline"
            size="xs"
            className="rounded-full cursor-move"
            onMouseDown={handleDragStart}
          >
            <Move className="size-2 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="xs" className="rounded-full" onClick={onClose}>
            <X className="size-3 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 bg-popover rounded-[8px] p-2">
          <LanguageSwitcher />
        </div>
      </div>
    );
  },
);

CustomPopup.displayName = "CustomPopup";
