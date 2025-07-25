import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Move, X } from "lucide-react";

export const PopupWrapper = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex w-[400px] max-w-[400px] flex-col gap-2 rounded-md bg-background p-3 pt-10 shadow-lg rounded-[16px]",
      )}
    >
      <div
        className="absolute left-0 right-0 top-0 h-10 cursor-move rounded-t-[16px]"
        data-draggle-wrapper
      />
      <div className="absolute right-2 top-2 flex gap-1">
        <Button
          variant="outline"
          size="xs"
          className="rounded-full cursor-move bg-accent"
          data-draggle-wrapper
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
      {children}
    </div>
  );
};
