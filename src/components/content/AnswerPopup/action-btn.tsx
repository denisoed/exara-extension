import { Button } from "@/components/ui/button";
import Logo from "~/assets/logo.svg?react";

export const ActionBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outline" size="xs" className="rounded-full shadow-lg" onClick={onClick}>
      <Logo className="size-3 text-muted-foreground" />
    </Button>
  );
};

ActionBtn.displayName = "ActionBtn";
