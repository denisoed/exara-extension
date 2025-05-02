import { useEffect, useCallback, useRef } from "react";
import { StorageKey, get } from "~/lib/localStorage";

interface UseScrollCloseProps {
  onClose: () => void;
  threshold?: number;
}

export function useScrollClose({ onClose, threshold = 50 }: UseScrollCloseProps) {
  const lastScrollYRef = useRef(window.scrollY);

  const handleScroll = useCallback(async () => {
    const isScrollCloseEnabled = (await get<boolean>(StorageKey.SCROLL_CLOSE)) || false;

    if (!isScrollCloseEnabled) {
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDiff = Math.abs(currentScrollY - lastScrollYRef.current);

    if (scrollDiff > threshold) {
      onClose();
      lastScrollYRef.current = currentScrollY;
    }
  }, [onClose, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
}
