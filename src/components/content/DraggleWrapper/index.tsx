import { Move } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface DraggleWrapperProps {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  disableX?: boolean; // disable dragging along X axis
  disableY?: boolean; // disable dragging along Y axis
}

export const DraggleWrapper = forwardRef<HTMLDivElement, DraggleWrapperProps>(
  ({ x, y, disableX = false, disableY = false }, ref) => {
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const handleDragStart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        // Calculate offset as difference between mouse percentage position and current element position
        const xOffset = (e.clientX / window.innerWidth * 100) - position.x;
        const yOffset = (e.clientY / window.innerHeight * 100) - position.y;

        setDragOffset({
          x: xOffset,
          y: yOffset,
        });
      },
      [position],
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();

        // Convert mouse position to percentages
        const xPercent = (e.clientX / window.innerWidth) * 100;
        const yPercent = (e.clientY / window.innerHeight) * 100;

        // Calculate new position in percentages
        const newX = xPercent - dragOffset.x;
        const newY = yPercent - dragOffset.y;

        // Update position respecting axis locks
        setPosition({
          x: disableX ? position.x : Math.min(Math.max(0, newX), 100),
          y: disableY ? position.y : Math.min(Math.max(0, newY), 100),
        });
      },
      [isDragging, dragOffset, position.x, position.y, disableX, disableY],
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Prevent text selection during dragging
    const preventTextSelection = useCallback((e: Event) => {
      e.preventDefault();
    }, []);

    // ------ HOOKS ------ //

    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("selectstart", preventTextSelection);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("selectstart", preventTextSelection);
      };
    }, [isDragging, handleMouseMove, handleMouseUp, preventTextSelection]);

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
          "fixed z-[999999999] flex flex-col gap-2 rounded-md bg-background shadow-lg rounded-[16px] text-base text-foreground select-none",
          "transition-transform duration-300 ease-out",
          "transform origin-center",
          {
            "translate-y-[-100px] opacity-0": !isVisible,
            "translate-y-0 opacity-100": isVisible,
            "cursor-move": !disableX && !disableY,
            "cursor-row-resize": !disableY && disableX,
            "cursor-col-resize": disableY && !disableX,
            "cursor-not-allowed": disableX && disableY,
          },
        )}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-${position.x}%, -${position.y}%)`, // This ensures the element is positioned relative to its own size
        }}
      >
        <Move 
          className={cn(
            "size-4",
            {
              "cursor-move": !disableX && !disableY,
              "cursor-row-resize": !disableY && disableX,
              "cursor-col-resize": disableY && !disableX,
              "cursor-not-allowed": disableX && disableY,
            }
          )} 
          onMouseDown={handleDragStart} 
        />
      </div>
    );
  },
);

DraggleWrapper.displayName = "DraggleWrapper";
