import { forwardRef, useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface DraggleWrapperProps {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  disableX?: boolean; // disable dragging along X axis
  disableY?: boolean; // disable dragging along Y axis
  children: React.ReactNode;
  onChange?: (x: number, y: number) => void;
}

export const DraggleWrapper = forwardRef<HTMLDivElement, DraggleWrapperProps>(
  ({ x, y, disableX = false, disableY = false, children, onChange }, ref) => {
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const handleDragStart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        // Calculate offset as difference between mouse percentage position and current element position
        const xOffset = (e.clientX / window.innerWidth) * 100 - position.x;
        const yOffset = (e.clientY / window.innerHeight) * 100 - position.y;

        setDragOffset({
          x: xOffset,
          y: yOffset,
        });

        // Add drag classes to the draggable element
        const target = e.target as HTMLElement;
        const draggableElement = target.closest("[data-draggle-wrapper]");
        if (draggableElement) {
          if (disableX) draggableElement.classList.add("disable-x");
          if (disableY) draggableElement.classList.add("disable-y");
        }
      },
      [position, disableX, disableY],
    );

    const handleChildMouseDown = useCallback(
      (e: React.MouseEvent) => {
        // Check if the clicked element or its parent has the data-draggle-wrapper attribute
        const target = e.target as HTMLElement;
        const draggableElement = target.closest("[data-draggle-wrapper]");

        if (draggableElement) {
          handleDragStart(e);
        }
      },
      [handleDragStart],
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
      // Remove drag classes from all draggable elements
      document.querySelectorAll("[data-draggle-wrapper]").forEach((element) => {
        element.classList.remove("disable-x", "disable-y");
      });
      onChange?.(position.x, position.y);
    }, [onChange, position.x, position.y]);

    // Prevent text selection during dragging only on draggable elements
    const preventTextSelection = useCallback((e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-draggle-wrapper]")) {
        e.preventDefault();
      }
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

    useEffect(() => {
      setPosition({ x, y });
    }, [x, y]);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-[999999999]",
          "transition-transform duration-300 ease-out",
          "transform origin-center",
          {
            "translate-y-[-100px] opacity-0": !isVisible,
            "translate-y-0 opacity-100": isVisible,
          },
        )}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-${position.x}%, -${position.y}%)`, // This ensures the element is positioned relative to its own size
        }}
        onMouseDown={handleChildMouseDown}
      >
        {children}
      </div>
    );
  },
);

DraggleWrapper.displayName = "DraggleWrapper";
