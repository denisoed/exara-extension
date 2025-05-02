import { getPageContext, isExaraContainer } from "@/lib/utils";
import { pixelsToPercentage } from "@/lib/utils/coordinates";
import { PopupState } from "@/types";
import { useEffect, useState, useCallback } from "react";

export function useTextSelector() {
  const [textSelectorState, setTextSelectorState] = useState<PopupState | null>(null);

  const clearSelection = useCallback(() => {
    setTextSelectorState(null);
  }, []);

  const onMouseUp = useCallback((event: MouseEvent) => {
    if (isExaraContainer(event.target)) {
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();
    const context = getPageContext();

    if (selectedText) {
      const coordinates = pixelsToPercentage({
        x: event.clientX + 20,
        y: event.clientY + 20,
      });

      setTextSelectorState({
        text: selectedText,
        context: `${context.pageTitle} - ${context.pageDescription}`,
        x: coordinates.x,
        y: coordinates.y,
      });
    }
  }, []);

  const onDocumentClick = useCallback((event: MouseEvent) => {
    if (isExaraContainer(event.target)) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      clearSelection();
    }
  }, [clearSelection]);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('click', onDocumentClick);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onMouseUp, onDocumentClick]);

  return {
    textSelectorState,
    clearSelection,
  };
}
