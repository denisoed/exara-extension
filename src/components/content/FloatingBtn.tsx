import Logo from "~/assets/logo.svg?react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function FloatingBtn() {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed right-4 top-1/2 z-50 -translate-y-1/2 rounded-full shadow-lg",
        "hover:bg-primary hover:text-primary-foreground",
      )}
    >
      <Logo className="w-20" />
    </Button>
  );
}
